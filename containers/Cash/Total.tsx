import useSWR from "swr";
import { omit } from "lodash";
import { Typography, Box, Stack } from "@mui/material";

import {
  ADMIN_CASH_END_POINT,
  ADMIN_CASH_PAYMENT_METHODS_END_POINT,
  ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT,
} from "__generated__/END_POINT";

import { useIntl } from "react-intl";
import { transformDate, transformUrl } from "libs";
import { FailToLoad, FormatNumber, LoadingDynamic as Loading } from "components";

const Total = ({ params }) => {
  const { messages } = useIntl();

  const { data: cashData, error: cashError } = useSWR(() => {
    const { type, payment_method, range } = params;

    let dateStart = range.startDate
      ? transformDate(range.startDate, "date_start")
      : undefined;

    let dateEnd = range.endDate ? transformDate(range.endDate, "date_end") : undefined;
    let paymentMethod = payment_method ? payment_method.id : undefined;
    let _type = type ? type.id : undefined;

    if (_type) {
      return transformUrl(`${ADMIN_CASH_TRANSACTIONS_TYPES_END_POINT}${_type}`, {
        date_start: dateStart,
        date_end: dateEnd,
      });
    }

    if (paymentMethod) {
      return transformUrl(`${ADMIN_CASH_PAYMENT_METHODS_END_POINT}${paymentMethod}`, {
        date_start: dateStart,
        date_end: dateEnd,
      });
    }

    return transformUrl(ADMIN_CASH_END_POINT, {
      ...omit(params, ["range", "range_params", "sid_icontains"]),
      type: _type,
      use_cache: false,
      date_end: dateEnd,
      date_start: dateStart,
      payment_method: paymentMethod,
    });
  });

  if (cashError) return <FailToLoad />;

  if (cashData == undefined) return <Loading />;

  return (
    <Stack
      columnGap={3}
      flexDirection="row"
      justifyContent="flex-end"
      sx={{
        padding: 2,
        backgroundColor: (theme) => {
          return theme.palette.grey[100];
        },
      }}
    >
      <Box>
        <Typography
          sx={{
            fontWeight: "fontWeightBold",
          }}
        >
          {messages["beginningBalance"]}
        </Typography>
        <Typography
          sx={{
            color: "info.main",
          }}
        >
          <FormatNumber children={cashData.beginning_balance.incl_tax} />
        </Typography>
      </Box>

      <Box>
        <Typography
          sx={{
            fontWeight: "fontWeightBold",
          }}
        >
          {messages["totalRevenue"]}{" "}
        </Typography>
        <Typography
          sx={{
            color: "primary.main",
          }}
        >
          <FormatNumber children={cashData.total_revenue.incl_tax} />
        </Typography>
      </Box>

      <Box>
        <Typography
          sx={{
            fontWeight: "fontWeightBold",
          }}
        >
          {messages["totalExpense"]}{" "}
        </Typography>
        <Typography
          sx={{
            color: "error.main",
          }}
        >
          <FormatNumber children={cashData.total_expense.incl_tax} />
        </Typography>
      </Box>

      <Box>
        <Typography
          sx={{
            fontWeight: "fontWeightBold",
          }}
        >
          {messages["totalBalance"]}{" "}
        </Typography>
        <Typography
          sx={{
            color: "success.main",
          }}
        >
          <FormatNumber children={cashData.total_balance.incl_tax} />
        </Typography>
      </Box>
    </Stack>
  );
};

export default Total;
