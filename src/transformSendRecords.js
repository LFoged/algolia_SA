import rawProductData from '../data/products.json'
import algoliasearch from 'algoliasearch';

const applyDiscount = (product = {}) => {
    const discountPercent = 20;
    const discountAmount =  product.price * (discountPercent / 100);
    return {
        ...product,
        // apply discount & round down to nearest whole number
        price: Math.floor(product.price - discountAmount)
    };
};

const updateCategoryPrice = (rawData = []) => {
    // category to apply price update to
    const updateCategory = 'camera'; 
    const updatedData = rawData.map((product = {}) => {
        if (product.categories.join(' ').toLowerCase().includes(updateCategory)) {
            return applyDiscount(product);
        }
        return product;
    });
    return updatedData;
};

const sendRecordsBatch = (records = []) => {
    const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
    const index = client.initIndex(process.env.ALGOLIA_INDEX);
    try {
        index.saveObjects(records, { autoGenerateObjectIDIfNotExist: true })
    } catch (error) {
        console.error({ success: false, message: 'Failed to upload records', error })
    }
}

const applyDiscountSendRecords = () => {
    const records = updateCategoryPrice(rawProductData);
    sendRecordsBatch(records)
}

applyDiscountSendRecords()
