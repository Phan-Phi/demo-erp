import pick from "lodash/pick";
import { AxiosRequestConfig } from "axios";

import axios from "axios.config";

import { transformUrl } from "libs";
import { CHOICE_CONVERT_DIVISION } from "apis";
import { ProvinceTuple, DistrictTuple, WardTuple } from "interfaces";
import { useRouter } from "next/router";

interface ProvinceDistrictWardProps {
  ward: WardTuple;
  district: DistrictTuple;
  province: ProvinceTuple;
}

export const convertValueToTupleForAddress = async <
  T extends { demo: boolean; province: string; district?: string; ward?: string },
>(
  data: T,
  options?: AxiosRequestConfig
): Promise<ProvinceDistrictWardProps | undefined> => {
  const body = pick(data, ["province", "district", "ward"]);
  // console.log("🚀 ~ data:", data);

  try {
    const controller = new AbortController();

    if (data.demo) {
      console.log("abort");
      controller.abort();
    }

    // setTimeout(() => {
    //   if (data.demo) {
    //     controller.abort();
    //   }
    // }, 200);

    const { data: resData } = await axios.get<
      [ward: string, district: string, province: string]
    >(
      transformUrl(CHOICE_CONVERT_DIVISION, {
        ...body,
        country: "vn",
      }),
      { ...options, signal: controller.signal }
    );

    let newObj: ProvinceDistrictWardProps = {} as ProvinceDistrictWardProps;

    // controller.abort();

    // console.log(controller.signal);

    newObj.ward = [body["ward"] ?? "", resData[0]];
    newObj.district = [body["district"] ?? "", resData[1]];
    newObj.province = [body["province"] ?? "", resData[2]];

    // console.log("🚀 ~ newObj:", newObj);
    return newObj;
  } catch (err) {}
};
