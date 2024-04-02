import React from "react";

import { DatePicker } from "components";

const TableCellForDatePicker = (props: React.ComponentProps<typeof DatePicker>) => {
  return (
    <div>
      <DatePicker {...props} />
    </div>
  );
};

export default TableCellForDatePicker;
