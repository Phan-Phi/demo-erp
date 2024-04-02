import { Fragment } from "react";

import { Card } from "components";
import { UsedByUserProvider } from "../context/UsedByUserProvider";

import ListUseByUser from "./ListUseByUser";
import AddUsedByUser from "./AddUsedByUser";

export default function ContainerUserByUser() {
  return (
    <Fragment>
      <UsedByUserProvider>
        <Card
          cardTitleComponent={() => {
            return <AddUsedByUser />;
          }}
          cardBodyComponent={() => {
            return <ListUseByUser />;
          }}
        />
      </UsedByUserProvider>
    </Fragment>
  );
}
