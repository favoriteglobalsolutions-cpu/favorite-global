

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
if (event.httpMethod !== 'POST') {
return { statusCode: 405, body: 'Method Not Allowed' };
}

try {
const {
productName,
priceCents,
size,
customerEmail,
customerName,
customerPhone,
shippingAddress
} = JSON.parse(event.body);

const session = await stripe.checkout.sessions.create({
payment_method_types: ['card'],
mode: 'payment',
customer_email: customerEmail,
line_items: [{
price_data: {
currency: 'usd',
product_data: {
name: productName,
description: `Size: ${size} | Favorite Global Solutions LLC`,
},
unit_amount: priceCents,
},
quantity: 1,
}],
shipping_address_collection: {
allowed_countries: ['US', 'HT', 'CA'],
},
metadata: {
size: size,
customerName: customerName,
customerPhone: customerPhone || '',
shippingLine1: shippingAddress?.line1 || '',
shippingCity: shippingAddress?.city || '',
shippingState: shippingAddress?.state || '',
shippingZip: shippingAddress?.zip || '',
},
success_url: 'https://sneakers.favoriteglobalsolutions.com?order=success',
cancel_url: 'https://sneakers.favoriteglobalsolutions.com?order=cancelled',
});

return {
statusCode: 200,
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ url: session.url }),
};
} catch (err) {
console.error('Stripe error:', err);
return {
statusCode: 500,
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ error: err.message }),
};
}
};
