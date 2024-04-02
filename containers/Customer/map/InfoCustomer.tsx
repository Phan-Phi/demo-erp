import React from "react";
import { get } from "lodash";
import { Grid } from "@mui/material";

import { FormControlBase } from "compositions";
import { ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type InfoCustomerProps = {
  data: ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1;
};

export default function InfoCustomer(props: InfoCustomerProps) {
  const { data } = props;

  return (
    <Grid>
      <Grid item xs={12}>
        <FormControlBase
          FormLabelProps={{
            children: "Tên",
          }}
          InputProps={{
            readOnly: true,
            value: `${get(data, "last_name")} ${get(data, "first_name")}`,
            placeholder: "Tên khách hàng",
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlBase
          FormLabelProps={{
            children: "Email",
          }}
          InputProps={{
            readOnly: true,
            value: get(data, "email"),
            placeholder: "Email",
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlBase
          FormLabelProps={{
            children: "Số điện thoại",
          }}
          InputProps={{
            readOnly: true,
            value: get(data, "main_phone_number"),
            placeholder: "Số điện thoại",
          }}
        />
      </Grid>
    </Grid>
  );
}
