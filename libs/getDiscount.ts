import { ACTIVE_DISCOUNT_TYPE } from "constant";

type Params = [dateStart: any, dateEnd: any];

type FunctionType = (...args: Params) => string;

export const getDiscount: FunctionType = (dateStart, dateEnd) => {
  const date = new Date();

  let _dateStart = new Date(dateStart);
  let _dateEnd = new Date(dateEnd);

  if (dateStart === null || dateEnd === null) {
    return ACTIVE_DISCOUNT_TYPE.happenning;
  }

  if (date.getTime() > _dateEnd.getTime()) {
    return ACTIVE_DISCOUNT_TYPE.end;
  }

  if (date.getTime() < _dateStart.getTime()) {
    return ACTIVE_DISCOUNT_TYPE.schedule;
  }

  if (date.getTime() > _dateStart.getTime() && date.getTime() < _dateEnd.getTime()) {
    return ACTIVE_DISCOUNT_TYPE.happenning;
  }

  return ACTIVE_DISCOUNT_TYPE.end;
};
