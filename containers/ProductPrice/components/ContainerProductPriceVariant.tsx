import { Fragment } from "react";

import { Card } from "components";
import { ProductPriceProvider } from "../context/ProductPriceProvider";

import AddProductPrice from "../connection/AddProductPrice";
import ListProductPriceVariant from "../connection/ListProductPriceVariant";

export default function ContainerProductPriceVariant() {
  return (
    <Fragment>
      <ProductPriceProvider>
        <Card
          cardTitleComponent={() => {
            return <AddProductPrice />;
          }}
          cardBodyComponent={() => {
            return <ListProductPriceVariant />;
          }}
        />
      </ProductPriceProvider>
    </Fragment>
  );
}
