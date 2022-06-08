
if (ENV == 'development') {
    Stripe.setPublishableKey('pk_test_5tu0lAMI2EyovdwAk95ordCK'); //live-test
}
if (ENV == 'test') {
    Stripe.setPublishableKey('pk_test_5tu0lAMI2EyovdwAk95ordCK'); //live-test
}
if (ENV == 'production') {
    Stripe.setPublishableKey('pk_test_5tu0lAMI2EyovdwAk95ordCK'); //live-test
}
if (ENV == 'demo') {
    Stripe.setPublishableKey('pk_test_5tu0lAMI2EyovdwAk95ordCK'); //live-test
}
if (ENV == 'live') {
    Stripe.setPublishableKey('pk_live_EqNLKgeJct2hLAD9Sy106Z4P');
}
