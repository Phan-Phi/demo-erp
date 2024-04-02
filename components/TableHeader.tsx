import { useIntl } from "react-intl";
import { Stack, StackProps, Typography, Button, Box } from "@mui/material";

import { Link } from "components";
import SelectedList from "compositions/SelectedList/SelectedList";

interface ITableHeader extends StackProps {
  title?: string;
  pathname?: string;
  objectTable?: any;
  showAndHideTable?: any;
}

export const TableHeader = (props: ITableHeader) => {
  const { children, title, objectTable, showAndHideTable, pathname, ...restProps } =
    props;
  const { messages } = useIntl();

  return (
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      {...restProps}
    >
      {title && <Typography variant="h6">{title}</Typography>}

      <Stack direction="row" alignItems="center" spacing={2}>
        {children}
        {pathname && (
          <Link href={pathname}>
            <Button>{messages["createNewButton"]}</Button>
          </Link>
        )}
        {objectTable && (
          <SelectedList showAndHideTable={showAndHideTable} columnTable={objectTable} />
        )}
      </Stack>
    </Stack>
  );
};
