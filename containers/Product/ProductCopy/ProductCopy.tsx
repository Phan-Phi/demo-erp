import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";

import useSWR from "swr";
import { boolean, object } from "yup";
import { chunk, get, isEmpty, set, unset } from "lodash";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Stack, MenuItem, Button, Autocomplete } from "@mui/material";

import {
  Card,
  NoData,
  BackButton,
  LoadingButton,
  LoadingDynamic as Loading,
} from "components";
import ImageThumbList from "../components/ImageThumbList";
import ImageUploadBox from "../components/ImageUploadBox";
import { FormControl, FormControlForRichText, InputForAutocomplete } from "compositions";

import axios from "axios.config";
import DynamicMessage from "messages";
import { COPY, CREATE, PRODUCTS, TYPE, VARIANT } from "routes";
import { useNotification, usePermission } from "hooks";
import { checkResArr, createRequest, transformUrl } from "libs";

import {
  IImage,
  productImageSchema,
  defaultProductImageFormState,
  connectProductWithCategorySchema,
  ConnectProductWithCategorySchemaProps,
} from "yups";

import {
  ADMIN_PRODUCTS_POST_SHAPE,
  ADMIN_PRODUCTS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import {
  ADMIN_PRODUCTS_END_POINT,
  ADMIN_PRODUCTS_TYPES_END_POINT,
  ADMIN_PRODUCTS_PRODUCT_CATEGORIES_END_POINT,
  ADMIN_PRODUCTS_IMAGES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1,
  ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1,
  ADMIN_PRODUCT_PRODUCT_CLASS_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_PRODUCTS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const Category = dynamic(() => import("../components/Category"), {
  loading: () => {
    return <Loading />;
  },
});

const Checkbox = dynamic(() => import("../components/Checkbox"), {
  loading: () => {
    return <Loading />;
  },
});
export interface DATA_PRODUCT_EXTEND extends ADMIN_PRODUCTS_POST_YUP_SCHEMA_TYPE {
  stop_business?: boolean;
}

const ProductCopy = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<DATA_PRODUCT_EXTEND>();

  const [defaultCategoryValue, setDefaultCategoryValue] =
    useState<ConnectProductWithCategorySchemaProps>();

  const { data: productData, mutate: productMutate } =
    useSWR<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1>(() => {
      const id = router.query.id;

      if (id == undefined) return;

      return transformUrl(`${ADMIN_PRODUCTS_END_POINT}${id}`, {
        use_cache: false,
      });
    });

  const { data: selectedCategoryData, mutate: selectedCategoryMutate } = useSWR<any[]>(
    () => {
      const id = router.query.id;

      if (id == undefined) return;

      const params = {
        get_all: true,
        product: id,
        use_cache: false,
      };

      return transformUrl(ADMIN_PRODUCTS_PRODUCT_CATEGORIES_END_POINT, params);
    }
  );

  useEffect(() => {
    if (productData == undefined) return;

    const data = {} as any;

    const keyList = [
      ...Object.keys(ADMIN_PRODUCTS_POST_DEFAULT_VALUE),
      "id",
      "default_variant",
    ];

    keyList.forEach((key) => {
      set(data, key, productData[key]);
    });

    const overrideData = {
      ...data,
      product_class: null,
      stop_business: get(productData, "available_for_purchase") === null ? true : false,
    };

    setDefaultValues(overrideData);
  }, [productData]);

  useEffect(() => {
    if (selectedCategoryData == undefined) {
      return;
    }

    const data = selectedCategoryData.map((el) => {
      return { ...el.category, connectId: el.id };
    });

    setDefaultCategoryValue({
      categories: data,
    });
  }, [selectedCategoryData]);

  if (defaultValues == undefined || defaultCategoryValue == undefined) {
    return <Loading />;
  }

  return <RootComponent {...{ defaultValues, defaultCategoryValue }} />;
};

type RootComponentProps = {
  defaultValues: DATA_PRODUCT_EXTEND;
  defaultCategoryValue: ConnectProductWithCategorySchemaProps;
};

const RootComponent = (props: RootComponentProps) => {
  const { defaultCategoryValue, defaultValues } = props;

  const { hasPermission: writePermission } = usePermission("write_product");

  const router = useRouter();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const ADMIN_PRODUCTS_POST_SHAPE_EXTENDS = Object.assign(ADMIN_PRODUCTS_POST_SHAPE, {
    stop_business: boolean().notRequired(),
  });

  const ADMIN_PRODUCTS_POST_YUP_SCHEMA_EXTENDS = object({}).shape(
    ADMIN_PRODUCTS_POST_SHAPE_EXTENDS
  );

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(ADMIN_PRODUCTS_POST_YUP_SCHEMA_EXTENDS),
  });

  const { control: productCategoryControl, handleSubmit: productCategoryHandleSubmit } =
    useForm({
      defaultValues: defaultCategoryValue,
      resolver: connectProductWithCategorySchema(),
    });

  const { control: productImageControl, handleSubmit: productImageHandleSubmit } =
    useForm({
      resolver: productImageSchema(),
      defaultValues: defaultProductImageFormState(),
    });

  const { fields, append, swap, remove } = useFieldArray({
    control: productImageControl,
    name: "images",
    keyName: "formId",
  });

  const { data: productTypeData } = useSWR<ADMIN_PRODUCT_PRODUCT_CLASS_VIEW_TYPE_V1[]>(
    () => {
      return transformUrl(ADMIN_PRODUCTS_TYPES_END_POINT, {
        get_all: true,
      });
    }
  );

  const onSubmit = useCallback(
    async ({
      data,
      categoryData,
      imageData,
    }: {
      data: DATA_PRODUCT_EXTEND;
      categoryData: ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1[];
      imageData: IImage[];
    }) => {
      setLoading(true);

      if (get(data, "stop_business")) {
        set(data, "available_for_purchase", null);
      }

      unset(data, "stop_business");
      unset(data, "id");
      unset(data, "default_variant");

      try {
        const { data: resData } = await axios.post(ADMIN_PRODUCTS_END_POINT, data);

        const productId = get(resData, "id");
        const variantId = get(resData, "default_variant.id");

        if (productId && variantId) {
          let resList: any[] = [];

          if (!isEmpty(categoryData)) {
            const transformedCategories = categoryData.map((el) => {
              let body = {};
              set(body, "product", productId);
              set(body, "category", el.id);
              return body;
            });

            const results = await createRequest(
              ADMIN_PRODUCTS_PRODUCT_CATEGORIES_END_POINT,
              transformedCategories
            );

            resList = [...resList, ...results];
          }

          if (!isEmpty(imageData)) {
            imageData = imageData.map((el, idx) => {
              return { ...el, sort_order: idx };
            });

            const chunkFileList = chunk(imageData, 5);

            for await (let arr of chunkFileList) {
              const results = await Promise.all(
                arr.map(async (file) => {
                  let formData = new FormData();
                  formData.append("product", productId);
                  formData.append("alt", file.alt);
                  formData.append("image", file.file);
                  formData.append("sort_order", file.sort_order.toString());

                  return axios.post(ADMIN_PRODUCTS_IMAGES_END_POINT, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  });
                })
              );

              resList = [...resList, ...results];
            }
          }

          const result = checkResArr(resList);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.createSuccessfully, {
                content: "sản phẩm",
              })
            );
            router.push(
              `/${PRODUCTS}/${COPY}/${router.query.id}/${PRODUCTS}/${productId}/${VARIANT}/${variantId}`
            );
          }
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  const children = useMemo(() => {
    if (productTypeData == undefined) {
      return (
        <Grid item xs={12}>
          <Loading />
        </Grid>
      );
    }

    return (
      <Fragment>
        <Grid item xs={12}>
          <Checkbox control={control} setValue={setValue} />
        </Grid>
        <Grid item xs={12}>
          <Category {...{ control: productCategoryControl }} />
        </Grid>
        <Grid item xs={12}>
          <Card
            title={messages["productType"] as string}
            cardBodyComponent={() => {
              if (productTypeData.length === 0) {
                return (
                  <Stack
                    direction="column"
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <NoData>{messages["noProductType"] as string}</NoData>

                    <Button
                      variant="contained"
                      onClick={() => {
                        let pathname = `/${PRODUCTS}/${TYPE}/${CREATE}`;

                        router.push(pathname, pathname, { shallow: true });
                      }}
                    >
                      {messages["createProductType"]}
                    </Button>
                  </Stack>
                );
              } else {
                return (
                  <Fragment>
                    <Controller
                      name="product_class"
                      control={control}
                      render={(props) => {
                        const { field, fieldState } = props;
                        const { value, onChange } = field;
                        const { error } = fieldState;

                        return (
                          <Autocomplete
                            options={productTypeData}
                            renderOption={(props, option) => {
                              return (
                                <MenuItem
                                  {...props}
                                  key={option.id}
                                  value={option.id}
                                  children={option.name}
                                />
                              );
                            }}
                            getOptionLabel={(option) => option.name}
                            value={value as any}
                            onChange={(_, value) => onChange(value)}
                            renderInput={(props) => {
                              return (
                                <InputForAutocomplete
                                  {...props}
                                  label={messages["productType"] as string}
                                  placeholder={messages["productType"] as string}
                                  error={!!error}
                                  errorMessage={error && error.message}
                                  FormControlProps={{ required: true }}
                                />
                              );
                            }}
                            isOptionEqualToValue={(option, value) => {
                              if (isEmpty(option) || isEmpty(value)) {
                                return true;
                              }

                              return option?.["id"] === value?.["id"];
                            }}
                          />
                        );
                      }}
                    />
                  </Fragment>
                );
              }
            }}
          />
        </Grid>
      </Fragment>
    );
  }, [productTypeData]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((data) => {
        productCategoryHandleSubmit((productCategoryData) => {
          const { categories: categoryData } = productCategoryData;

          productImageHandleSubmit((productImageData) => {
            const { images: imageData } = productImageData;

            onSubmit({
              data,
              categoryData,
              imageData: imageData as IImage[],
            });
          })();
        })();
      })}
    >
      <Grid container>
        <Grid item xs={8}>
          <Card
            title={messages["productInfo"] as string}
            body={
              <Grid container>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="name"
                    render={(props) => {
                      return (
                        <FormControl
                          controlState={props}
                          label={messages["productName"] as string}
                          placeholder={messages["productName"] as string}
                          FormControlProps={{ required: true }}
                        />
                      );
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="description"
                    render={(props) => {
                      return (
                        <FormControlForRichText
                          controlState={props}
                          label={messages["productDescription"] as string}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ImageUploadBox
                    onDrop={(acceptedFiles) => {
                      acceptedFiles.forEach((el, idx) => {
                        const { name } = el;

                        append({
                          file: el,
                          alt: name,
                          sort_order: fields.length + idx,
                        });
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ImageThumbList
                    {...{
                      data: fields,
                      swap,
                      remove,
                    }}
                  />
                </Grid>
              </Grid>
            }
          />
        </Grid>

        <Grid item xs={4}>
          <Grid container>{children}</Grid>
        </Grid>

        <Grid item xs={12}>
          <Stack flexDirection="row" justifyContent="flex-end" columnGap={2}>
            <BackButton pathname={`/${PRODUCTS}`} disabled={loading} />
            <LoadingButton loading={loading} type="submit">
              {loading ? messages["creatingStatus"] : messages["createStatus"]}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductCopy;
