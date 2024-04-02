import { Fragment } from "react";

import { Card } from "components";
import { ACTIVE_DISCOUNT_TYPE } from "constant";
import { DiscountedVariantProvider } from "../context/DiscountedVariantProvider";

import AddDiscountedVariant from "./AddDiscountedVariant";
import ListDiscountedVariant from "./ListDiscountedVariant";

interface Props {
  type: string;
}

export default function ContainerDiscountedVariantV2({ type }: Props) {
  return (
    <Fragment>
      <DiscountedVariantProvider>
        <Card
          cardTitleComponent={() => {
            if (
              type === ACTIVE_DISCOUNT_TYPE.end ||
              type === ACTIVE_DISCOUNT_TYPE.happenning
            ) {
              return;
            }
            return <AddDiscountedVariant />;
          }}
          cardBodyComponent={() => {
            return <ListDiscountedVariant type={type} />;
          }}
        />
      </DiscountedVariantProvider>
    </Fragment>
  );
}
