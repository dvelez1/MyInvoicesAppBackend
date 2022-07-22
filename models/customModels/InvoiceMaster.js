
import invoiceMaster from require("../invoiceMaster.model");
import invoiceDetails from require("../invoiceDetails.model");
import invoicePayments from require("../InvoicePayments.model")

// Todo: See how I can make a custom Model with array as property
const customInvoice  = {
invoiceMaster,
invoiceDetails:[invoiceDetails],
invoicePayments:[invoicePayments]

}


export {
    customInvoice
}