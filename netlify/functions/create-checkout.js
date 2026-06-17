


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
if (event.httpMethod !== 'POST') {
return { statusCode: 405, body: 'Method Not Allowed' };
}
try {
const { productName, priceCents, size, customerEmail, customerName, customerPhone, shippingAddress } = JSON.parse(event.body);
const session = await stripe.checkout.sessions.create({
payment_method_types: ['card'],
line_items: [{ price_data: { currency: 'usd', product_data: { name: productName, description: `Size: ${size} | Favorite Global Solutions LLC` }, unit_amount: priceCents }, quantity: 1 }],
mode: 'payment',
customer_email: customerEmail,
shipping_address_collection: { allowed_countries: ['US', 'HT', 'CA'] },
metadata: { customer_name: customerName, customer_phone: customerPhone, size: size, ship_address: `${shippingAddress.line1}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}` },
success_url: `${event.headers.origin}/success.html?product=${encodeURIComponent(productName)}&size=${encodeURIComponent(size)}`,
cancel_url: `${event.headers.origin}/`,
});
return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: session.url }) };
} catch (err) {
return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: err.message }) };
}
};
