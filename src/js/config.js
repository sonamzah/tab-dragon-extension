export const PREV_TITLE_LEN = 14;
// export const STORAGE_PADDING_BYTES = 7000; // This value creates too much space between end of storage
export const STORAGE_PADDING_BYTES = 500;
// Putting at 0 for now -- can maybe remove all logic used in differentiating this? in model.storageIsMaxed
// Maybe not though cause one is checking if a specific collection will fit in storage and the above is
// For checking if there is any room in storage at all
