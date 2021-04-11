export const Gender = [
  { text: 'Male', value: 1 },
  { text: 'Female', value: 2 },
]

export const Coins = [
  { text: 'ETH', value: 'eth', decimals: 18, icon: '/images/icons/logo-ether.svg' },
]

export const ProductTypes = [
  { text: 'Belt', value: 2 },
  { text: 'T-Shirt', value: 1 },
]

export const SellingStatuses = [
  { text: 'All Status', value: '', canEditable: false, textColor: '' },
  { text: 'Off sale', value: 'off_sale', canEditable: true, textColor: 'text-offsale' },
  { text: 'On sale', value: 'on_sale', canEditable: true, textColor: 'text-onsale' },
  { text: 'Holding', value: 'holding', canEditable: false, textColor: 'text-holding' },
  { text: 'Sold', value: 'sold', canEditable: false, textColor: 'text-sold' },
  { text: 'Confirming', value: 'confirming', canEditable: false, textColor: 'text-confirming' },
]

export const SellingConfirmingTypes = [
  { text: 'Confirming', value: 'confirming_create', canEditable: false, textColor: 'text-confirming' },
  { text: 'Confirming', value: 'confirming_update', canEditable: false, textColor: 'text-confirming' },
  { text: 'Confirming', value: 'confirming_cancel', canEditable: false, textColor: 'text-confirming' },
]

export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
}

export const Web3Error = {
  META_MASK_NOT_INSTALLED: 'META_MASK_NOT_INSTALLED',
  CHAIN_ID_NOT_MATCH: 'CHAIN_ID_NOT_MATCH',
  CONNECTION_TIME_OUT: 'CONNECTION_TIME_OUT',
  BROWSER_NOT_SUPPORT: 'BROWSER_NOT_SUPPORT',
}

export const SmartContractMethod = {
  ISSUE_AND_CREATE_SINGLE_PRODUCT_ORDER: 'issueAndCreateSingleProductOrder',
  CREATE_SINGLE_PRODUCT_ORDER: 'createSingleProductOrder',
  UPDATE_ORDER: 'updateOrder',
  CANCEL_ORDER: 'cancelOrder',
  HAS_EXISTENT_TOKEN: 'hasExistentToken',
  HAS_EXISTENT_ORDER: 'hasExistentOrder',
}

export const OrderMethod = {
  CREATE: 'create',
  UPDATE: 'update',
  CANCEL: 'cancel',
}
