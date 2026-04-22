<template>
  <div class="container">
    <h1 class="page-title">Best Buy Store</h1>

    <div class="layout">
      <div class="products-section">
        <h2 class="section-title">Products</h2>
        <div v-if="products.length === 0">Loading products...</div>

        <div class="products-grid">
          <div v-for="product in products" :key="product._id" class="product-card">
            <img
              :src="product.image"
              alt="product image"
              class="product-image"
              @error="handleImageError"
            />
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <p><strong>${{ product.price }}</strong></p>
            <p>Stock: {{ product.stock }}</p>
            <button
              class="btn btn-primary"
              @click="addToCart(product)"
              :disabled="product.stock <= 0"
            >
              {{ product.stock <= 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>

      <div class="cart-section">
        <h2 class="section-title">Cart</h2>

        <div class="customer-form">
          <input
            v-model="customerName"
            type="text"
            placeholder="Enter your name"
          />
          <input
            v-model="customerEmail"
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <div v-if="cart.length === 0">Cart is empty</div>

        <div v-for="item in cart" :key="item._id" class="cart-item">
          <p>{{ item.name }} x {{ item.quantity }}</p>
          <p>${{ item.price }} each</p>
          <p>Subtotal: ${{ (item.price * item.quantity).toFixed(2) }}</p>
          <button class="btn btn-delete" @click="removeFromCart(item._id)">
            Remove
          </button>
        </div>

        <h3 v-if="cart.length > 0" class="total">Total: ${{ cartTotal }}</h3>

        <button
          v-if="cart.length > 0"
          class="btn btn-primary place-order-btn"
          @click="placeOrder"
        >
          Place Order
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { productApi, orderApi } from './services/api'

const products = ref([])

const cart = ref([])
const customerName = ref('')
const customerEmail = ref('')

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0).toFixed(2)
})

const removeFromCart = (productId) => {
  cart.value = cart.value.filter(item => item._id !== productId)
}

const fetchProducts = async () => {
  try {
    const response = await productApi.get('/products')
    products.value = response.data
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const addToCart = (product) => {
  const existing = cart.value.find(item => item._id === product._id)

  if (existing) {
    existing.quantity += 1
  } else {
    cart.value.push({
      ...product,
      quantity: 1
    })
  }
}

const placeOrder = async () => {
  try {
    if (!customerName.value.trim() || !customerEmail.value.trim()) {
      alert('Please enter your name and email')
      return
    }

    const orderPayload = {
      customerName: customerName.value,
      customerEmail: customerEmail.value,
      items: cart.value.map(item => ({
        productId: item._id,
        sku: item.sku,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    }

    console.log('Sending order:', orderPayload)

    const response = await orderApi.post('/orders', orderPayload)
    console.log('Order success:', response.data)

    alert('Order placed successfully!')
    cart.value = []
    customerName.value = ''
    customerEmail.value = ''
  } catch (error) {
    console.error('Error placing order:', error)
    console.error('Response data:', error.response?.data)
    console.error('Response status:', error.response?.status)
    alert('Failed to place order')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #ffe000;
  background: #000;
  padding: 14px 18px;
  letter-spacing: 1px;
}

.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  align-items: start;
}

.products-section,
.cart-section {
  background: #fff;
  border: 1px solid #eee;
  padding: 18px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.product-card {
  border: 1px solid #eee;
  padding: 14px;
  background: #fff;
}

.product-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  margin-bottom: 10px;
  background: #f8f8f8;
}

.product-card h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #111;
}

.product-card p {
  margin: 6px 0;
  font-size: 14px;
  color: #555;
}

.customer-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.customer-form input {
  padding: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.cart-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.cart-item p {
  margin: 4px 0;
  font-size: 14px;
  color: #555;
}

.total {
  margin-top: 14px;
  font-size: 16px;
  font-weight: 600;
  color: #111;
}

.form-actions {
  margin-top: 12px;
}

.btn {
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #ffe000;
  color: #000;
}

.btn-secondary {
  background: #f2f2f2;
  color: #000;
}

.btn-delete {
  background: #000;
  color: #fff;
}

.btn:disabled {
  background: #ddd;
  color: #888;
  cursor: not-allowed;
}

.place-order-btn {
  width: 100%;
  margin-top: 12px;
}

.out-of-stock {
  color: #c00;
  font-weight: 600;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>