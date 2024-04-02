import {
  Grid,
  Button,
  Dialog,
  MenuItem,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { isEmpty } from "lodash";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useNotification } from "hooks";
import { ISSUES_OBJECT_ID } from "constant";
import { FormControlForSelect } from "compositions";
import { LazyAutocomplete, LoadingButton } from "components";
import { LazyAutocomplete as LazyAutocomplete2 } from "compositions";

import axios from "axios.config";
import DynamicMessage from "messages";

import {
  ADMIN_USERS_END_POINT,
  ADMIN_CUSTOMERS_END_POINT,
  ADMIN_ORDERS_INVOICES_END_POINT,
  ADMIN_ISSUES_RELATED_ITEMS_END_POINT,
  ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT,
} from "__generated__/END_POINT";
import { ADMIN_ISSUES_RELATED_ITEMS_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import { ADMIN_ISSUES_RELATED_ITEMS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

interface Props {
  handleClose: () => void;
  resetTable: () => void;
  open: boolean;
  id?: number;
  isID: boolean;
}

export type IssuesRelatedFilterType = {
  gender: string;
};

export default function ModalFormissuesRelated({
  handleClose,
  resetTable,
  id,
  isID,
  open,
}: Props) {
  const [objectID, setObjectID] = useState<number>(-1);

  const router = useRouter();
  const isMounted = useMountedState();
  const { messages, formatMessage } = useIntl();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: { ...ADMIN_ISSUES_RELATED_ITEMS_POST_DEFAULT_VALUE },
    resolver: ADMIN_ISSUES_RELATED_ITEMS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: any }) => {
      try {
        setLoading(true);
        await axios.post(ADMIN_ISSUES_RELATED_ITEMS_END_POINT, {
          issue: isID ? id : router.query.idx,
          content_type: data.content_type,
          object_id: objectID,
        });

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "loại dữ liệu",
          })
        );

        resetTable();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [objectID, id, isID]
  );

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Tạo dữ liệu liên quan</DialogTitle>

      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="content_type"
              render={(props) => {
                return (
                  <FormControlForSelect
                    controlState={props}
                    renderItem={() => {
                      return ISSUES_OBJECT_ID.map((el) => {
                        return (
                          <MenuItem key={el[0]} value={el[0]}>
                            {el[1]}
                          </MenuItem>
                        );
                      });
                    }}
                    label={messages["shippingMethodType"] as string}
                    SelectProps={{
                      onChange(event, value: any) {
                        if (value == undefined) return;
                        setValue("content_type", value.props.value);
                      },
                    }}
                  />
                );
              }}
            />
          </Grid>

          <Grid item xs={12}>
            {watch("content_type") === "customer.customer" && (
              <LazyAutocomplete2<Required<any>>
                {...{
                  url: ADMIN_CUSTOMERS_END_POINT,
                  label: "Khách hàng",
                  placeholder: "Chọn khách hàng",
                  AutocompleteProps: {
                    renderOption(props, option) {
                      return (
                        <MenuItem
                          {...props}
                          key={option.id}
                          value={option.id}
                          children={`${option?.first_name} ${option?.last_name}`}
                        />
                      );
                    },

                    isOptionEqualToValue: (option, value) => {
                      if (isEmpty(option) || isEmpty(value)) {
                        return true;
                      }

                      return option?.["id"] === value?.["id"];
                    },

                    getOptionLabel: (option) => {
                      return `${option?.first_name} ${option?.last_name}`;
                    },

                    onChange: (e, value: any) => {
                      if (value == undefined) return;
                      setObjectID(value.id);
                    },
                    // value: filter.product_variant,
                  },
                }}
              />
            )}

            {watch("content_type") === "stock.receiptorder" && (
              <LazyAutocomplete2<Required<any>>
                {...{
                  url: ADMIN_WAREHOUSES_PURCHASE_ORDERS_RECEIPT_ORDERS_END_POINT,
                  label: "Nhập hàng",
                  placeholder: "Chọn nhập hàng",
                  AutocompleteProps: {
                    renderOption(props, option) {
                      return (
                        <MenuItem
                          {...props}
                          key={option.id}
                          value={option.id}
                          children={option?.sid}
                        />
                      );
                    },

                    isOptionEqualToValue: (option, value) => {
                      if (isEmpty(option) || isEmpty(value)) {
                        return true;
                      }

                      return option?.["id"] === value?.["id"];
                    },

                    getOptionLabel: (option) => {
                      return option?.sid;
                    },

                    onChange: (e, value: any) => {
                      if (value == undefined) return;
                      setObjectID(value.id);
                    },
                  },
                }}
              />
            )}

            {watch("content_type") === "account.user" && (
              <LazyAutocomplete2<Required<any>>
                {...{
                  url: ADMIN_USERS_END_POINT,
                  label: "Sale",
                  placeholder: "Chọn sale",
                  AutocompleteProps: {
                    renderOption(props, option) {
                      return (
                        <MenuItem
                          {...props}
                          key={option.id}
                          value={option.id}
                          children={`${option.first_name} ${option.last_name}`}
                        />
                      );
                    },

                    isOptionEqualToValue: (option, value) => {
                      if (isEmpty(option) || isEmpty(value)) {
                        return true;
                      }

                      return option?.["id"] === value?.["id"];
                    },

                    getOptionLabel: (option) => {
                      return `${option.first_name} ${option.last_name}`;
                    },

                    onChange: (e, value: any) => {
                      if (value == undefined) return;
                      setObjectID(value.id);
                    },
                  },
                }}
              />
            )}

            {watch("content_type") === "order.invoice" && (
              <LazyAutocomplete2<Required<any>>
                {...{
                  url: ADMIN_ORDERS_INVOICES_END_POINT,
                  label: "Hóa đơn",
                  placeholder: "Chọn hóa đơn",
                  AutocompleteProps: {
                    renderOption(props, option) {
                      return (
                        <MenuItem
                          {...props}
                          key={option.id}
                          value={option.id}
                          children={option?.sid}
                        />
                      );
                    },

                    isOptionEqualToValue: (option, value) => {
                      if (isEmpty(option) || isEmpty(value)) {
                        return true;
                      }

                      return option?.["id"] === value?.["id"];
                    },

                    getOptionLabel: (option) => {
                      return `${option?.sid}`;
                    },

                    onChange: (e, value: any) => {
                      if (value == undefined) return;
                      setObjectID(value.id);
                    },
                  },
                }}
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>

        <LoadingButton
          {...{
            loading,
            disabled: loading,
            onClick: handleSubmit(
              (data) => {
                onSubmit({ data });
              },
              (err) => {}
            ),
          }}
        >
          {loading ? messages["creatingStatus"] : messages["createStatus"]}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
