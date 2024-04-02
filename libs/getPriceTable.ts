const PERCENT = 100;
const PRICE = 1000;
const COUNT_INDEX = 3;
const ARR_ZERO = [0, 0, 0];

export const getPriceTable = (type, changeAmount, price): number => {
  let total;
  //thuế của sản phẩm gốc
  const priceVAT1 = price.incl_tax / price.excl_tax - 1;
  const priceVAT = priceVAT1 * PERCENT;

  //tỷ lệ chiết khấu
  if (type === "discount_percentage") {
    const discountPercentage =
      (parseFloat(price.excl_tax) * parseFloat(changeAmount)) / PERCENT;

    const totalDiscountPercentage = parseFloat(price.excl_tax) - discountPercentage;

    const VAT = (totalDiscountPercentage * priceVAT) / PERCENT;
    const totalFnc = totalDiscountPercentage + VAT;

    if (discountPercentage <= 0) {
      return 0;
    }

    // return (total = totalFnc);
    total = totalFnc;
  }

  //tăng tỷ lệ chiết khấu
  if (type === "increase_percentage") {
    const discountPercentage =
      (parseFloat(price.excl_tax) * parseFloat(changeAmount)) / PERCENT;
    const totalDiscountPercentage = parseFloat(price.excl_tax) + discountPercentage;

    const VAT = (totalDiscountPercentage * priceVAT) / PERCENT;
    const totalFnc = totalDiscountPercentage + VAT;

    if (discountPercentage <= 0) {
      return (total = 0);
    }

    // return (total = totalFnc);
    total = totalFnc;
  }

  //tỷ lệ tuyệt đối
  if (type === "discount_absolute") {
    const value = parseFloat(price.excl_tax) - parseFloat(changeAmount);

    const VAT = (priceVAT * value) / PERCENT;
    const totalFnc = value + VAT;

    // return (total = totalFnc);
    total = totalFnc;
  }

  //tăng tỷ lệ tuyệt đối
  if (type === "increase_absolute") {
    const value = parseFloat(price.excl_tax) + parseFloat(changeAmount);

    const VAT = (priceVAT * value) / PERCENT;
    const totalFnc = value + VAT;

    // return (total = totalFnc);
    total = totalFnc;
  }

  if (type === "fixed_price") {
    total = parseFloat(changeAmount);
  }

  // if (total) {
  //   if (total < PRICE) {
  //     total = PRICE;
  //   } else {
  //     const currentData = total.toString().split("").map(Number);
  //     const count = currentData.length - COUNT_INDEX;

  //     let data = currentData;
  //     const spliceData = Number(data.splice(count, COUNT_INDEX).join(""));

  //     total =
  //       spliceData <= 500
  //         ? Number(data.concat(ARR_ZERO).join(""))
  //         : Number(data.concat(ARR_ZERO).join("")) + PRICE;
  //   }
  // }

  return total;
};

// export const getPriceTable = (type, changeAmount, price): number => {
//   //thuế của sản phẩm gốc
//   const priceVAT1 = price.incl_tax / price.excl_tax - 1;
//   const priceVAT = priceVAT1 * 100;

//   //tỷ lệ chiết khấu
//   if (type === "discount_percentage") {
//     const discountPercentage =
//       (parseFloat(price.excl_tax) * parseFloat(changeAmount)) / 100;

//     const totalDiscountPercentage = parseFloat(price.excl_tax) - discountPercentage;

//     const VAT = (totalDiscountPercentage * priceVAT) / 100;
//     const total = totalDiscountPercentage + VAT;

//     if (discountPercentage <= 0) {
//       return 0;
//     }

//     return total;
//   }

//   //tăng tỷ lệ chiết khấu
//   if (type === "increase_percentage") {
//     const discountPercentage =
//       (parseFloat(price.excl_tax) * parseFloat(changeAmount)) / 100;
//     const totalDiscountPercentage = parseFloat(price.excl_tax) + discountPercentage;

//     const VAT = (totalDiscountPercentage * priceVAT) / 100;
//     const total = totalDiscountPercentage + VAT;

//     if (discountPercentage <= 0) {
//       return 0;
//     }

//     return total;
//   }

//   //tỷ lệ tuyệt đối
//   if (type === "discount_absolute") {
//     const value = parseFloat(price.excl_tax) - parseFloat(changeAmount);

//     const VAT = (priceVAT * value) / 100;
//     const total = value + VAT;

//     return total;
//   }

//   //tăng tỷ lệ tuyệt đối
//   if (type === "increase_absolute") {
//     const value = parseFloat(price.excl_tax) + parseFloat(changeAmount);

//     const VAT = (priceVAT * value) / 100;
//     const total = value + VAT;

//     return total;
//   }

//   return 0;
// };
