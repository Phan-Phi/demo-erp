import {
  ADMIN_CUSTOMERS_END_POINT,
  ADMIN_ORDERS_END_POINT,
  ADMIN_USERS_END_POINT,
  ADMIN_WAREHOUSES_END_POINT,
} from "__generated__/END_POINT";

export const IDLE = "IDLE";
export const FAIL = "FAIL";
export const ERROR = "ERROR";
export const LOADING = "LOADING";
export const SUCCESS = "SUCCESS";
export const WARNING = "WARNING";
export const SPECIALS = /[*|\/-_":.,+=?<>[\]{}`\\()';!#%@&$]/;

export const WRAPPER_TABLE_BOX_SHADOW =
  "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)";

export const SAFE_OFFSET = {
  top: 24,
  bottom: 24,
};

export const SELECTED_TABLE = {
  user: ["note", "last_edit_time", "facebook"],
  transaction: ["note", "owner_name", "last_edit_time"],
  partners: [
    "person_in_charge",
    "email",
    "max_debt",
    "tax_identification_number",
    "note",
    "last_edit_time",
  ],
  customers: ["email", "facebook", "tax_identification_number", "note", "company_name"],
  customersDraft: [
    "email",
    "facebook",
    "tax_identification_number",
    "note",
    "company_name",
  ],
  invoice: ["surcharge", "amount", "shippingInclTax", "owner_name", "last_edit_time"],
  purchase_orders: ["noteCreator", "note", "last_edit_time"],
  orders: [
    "shipping_method_name",
    "table.customer_notes",
    "delivery_notes",
    "last_edit_time",
  ],
  product: [
    "sku",
    "temporarily_out_of_stock",
    "productCategory",
    "publicationDate",
    "productClassName",
    "availableForPurchase",
    "isPublished",
    "last_edit_time",
  ],
};

export const SELECTED_PRODUCT_TYPE = [
  "discount_percentage",
  "increase_percentage",
  "discount_absolute",
  "increase_absolute",
  "fixed_price",
];

export const SELECTED_DISCOUNT_TYPE = [
  ["discount_percentage", "Giảm tỷ lệ chiết khấu"],
  ["increase_percentage", "Tăng tỷ lệ chiết khấu"],
  ["discount_absolute", "Giảm giá tuyệt đối"],
  ["increase_absolute", "Tăng giá tuyệt đối"],
  ["fixed_price", "Giá cố định"],
];

export const DIRECTION_TYPE = [
  {
    name: "Tăng",
    value: "in",
  },
  {
    name: "Giảm",
    value: "out",
  },
];

export const REASON_TYPE = [
  {
    name: "Khách trả hàng",
    value: "customer_return",
  },
  {
    name: "Trả NCC",
    value: "partner_return",
  },
  {
    name: "Ecom trả hàng",
    value: "ecommerce_return",
  },
  {
    name: "Lệch kho",
    value: "storage_miss_match",
  },
  {
    name: "Hết date",
    value: "product_expiration",
  },
  {
    name: "Khác",
    value: "other",
  },
];

export const PRICE_TABLE_USAGE_LIMIT_ITEM_VIEW = [
  {
    name: "Sale phụ trách",
    value: "account.user",
  },
  {
    name: "Khách hàng",
    value: "customer.customer",
  },
];

export const REASON_TYPE_IN = [
  {
    name: "Khách trả hàng",
    value: "customer_return",
  },
  {
    name: "Ecom trả hàng",
    value: "ecommerce_return",
  },
  {
    name: "Khác",
    value: "other",
  },
];

export const REASON_TYPE_OUT = [
  {
    name: "Trả NCC",
    value: "partner_return",
  },
  {
    name: "Lệch kho",
    value: "storage_miss_match",
  },
  {
    name: "Hết date",
    value: "product_expiration",
  },
  {
    name: "Khác",
    value: "other",
  },
];

export const MEDTHOD_WAREHOUSE_CARD = [
  {
    name: "Điều chỉnh tồn kho",
    value: "stock.stockoutnote",
  },
  {
    name: "Hóa đơn",
    value: "order.invoice",
  },

  {
    name: "Trả hóa đơn",
    value: "order.returninvoice",
  },
  {
    name: "Trả hàng",
    value: "stock.returnorder",
  },
  {
    name: "Nhập hàng",
    value: "stock.receiptorder",
  },

  // {
  //   name: "Giao Dịch",
  //   value: "cash.transaction",
  // },
];

export const PRICE_TYPE = [
  // {
  //   name: "Mã giảm giá",
  //   value: "discount.voucher",
  // },
  {
    name: "Bảng giá",
    value: "price_table.pricetable",
  },
];

export const TAG_GROUP_SOURCE_TYPE = [
  ["partner.partner", "Nhà cung cấp"],
  ["order.order", "Đơn hàng"],
  ["order.invoice", "Hoá đơn "],
  ["customer.customer", "Khách hàng"],
  ["issue.issue", "Khiếu nại"],
  ["stock.purchaserequest", "Yêu cầu đặt hàng"],
];

export const ISSUES_OBJECT_ID = [
  ["customer.customer", "Khách hàng"],
  ["stock.receiptorder", "Nhập hàng"],
  ["account.user", "Sale phụ trách"],
  ["order.invoice", "Hóa đơn"],
];

export const ISSUES_OBJECT_ID_ARR = [
  { type: "order.invoice", url: ADMIN_ORDERS_END_POINT },
  { type: "customer.customer", url: ADMIN_CUSTOMERS_END_POINT },
  { type: "account.user", url: ADMIN_USERS_END_POINT },
  { type: "stock.receiptorder", url: ADMIN_WAREHOUSES_END_POINT },
];

export const IS_BELOW_THRESHOLD_TYPE = [
  {
    name: "Chưa cài đặt",
    value: "false",
  },
  {
    name: "Tồn kho thấp",
    value: "true",
  },
];

export const SOURCE_TYPE_FOR_TAGS = {
  order: "order.order",
  orderInvoice: "order.invoice",
  partner: "partner.partner",
  customer: "customer.customer",
  issue: "issue.issue",
  purchase_request: "stock.purchaserequest",
};

export const SOURCE_TYPE_FOR_SID = [
  {
    value: "stock.receiptorder",
  },
  {
    value: "stock.stockoutnote",
  },
  {
    value: "stock.returnorder",
  },
  {
    value: "cash.transaction",
  },
  {
    value: "order.invoice",
  },
  {
    value: "order.returninvoice",
  },
];
export const ACTIVE_DISCOUNT_TYPE = {
  schedule: "discount_schedule",
  end: "discount_end",
  happenning: "discount_happenning",
};

export const TITLE_OF_PERMISSION = [
  ["cash.paymentmethod", "Phương thức thanh toán"],
  ["cash.transactiontype", "Loại giao dịch"],
  ["cash.transaction", "Giao dịch"],
  ["cash.debtrecord", "Lịch sử nợ"],
  ["site_setting.sitesettings", "Thông tin cài đặt"],
  ["account.user", "Tài khoản"],
  ["shipping.shippingmethod", "Phương thức vận chuyển"],
  ["shipping.shipper", "Đối tác giao hàng"],
  ["catalogue.attribute", "Thuộc tính"],
  ["catalogue.category", "Danh mục"],
  ["catalogue.product", "Sản phẩm"],
  ["catalogue.productclass", "Loại sản phẩm"],
  ["partner.partner", "Đối tác"],
  ["stock.purchaseorder", "Đơn đặt mua"],
  ["stock.receiptorder", "Đơn nhập hàng"],
  ["stock.returnorder", "Đơn trả hàng"],
  ["stock.stockoutnote", "Đơn xuất kho"],
  ["stock.warehouse", "Kho"],
  ["discount.sale", "Chương trình giảm giá"],
  ["discount.voucher", "Voucher"],
  ["order.invoice", "Hóa đơn"],
  ["order.order", "Đơn hàng"],
  ["order.purchasechannel", "Kênh bán"],
  ["customer.customertype", "Nhóm khách hàng"],
  ["customer.customer", "Khách hàng"],
  ["export.exportfile", "Xuất file"],
  ["tag.taggroup", "Tags"],
  ["auditlog.auditlog", "Lịch sử thao tác"],
  ["price_table.pricetable", "Bảng giá"],
  ["order.returninvoice", "Đơn trả hàng hoá đơn"],
  ["issue.issue", "Khiếu nại"],
  ["stock.purchaserequest", "Yêu cầu đặt hàng"],
];

// Map4D

export const DEFAULT_COORDINATE = { lat: 10.827673286563225, lng: 106.58499266955454 };

export const MAP_OPTIONS = {
  zoom: 15,
  controls: false,
  center: DEFAULT_COORDINATE,
};

export const SETTING_EVENTS_MAP4D = {
  marker: true,
  location: true,
  polygon: true,
  polyline: true,
  circle: true,
  poi: true,
  building: true,
  mappoi: true,
  mapbuilding: true,
};

export const ACCESS_KEY_MAP_4D = process.env.NEXT_PUBLIC_MAP_KEY || "";

export const SETTING_ICON = {
  width: 26,
  height: 35,
  url: "/marker.png",
};
