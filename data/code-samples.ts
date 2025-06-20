export const javascriptExample = `// This is a JavaScript function with proper syntax highlighting
function calculateTotal(items) {
  return items
    .filter(item => item.price > 0)
    .map(item => item.price * item.quantity)
    .reduce((total, price) => total + price, 0);
}

const cart = [
  { name: 'Product 1', price: 10, quantity: 2 },
  { name: 'Product 2', price: 5, quantity: 4 }
];

console.log(\`Total: $\${calculateTotal(cart)}\`);`;

export const cssExample = `/* CSS with syntax highlighting */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  padding: 2rem;
  background-color: var(--bg-primary);
}

.card {
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}`;

export const typescriptExample = `// TypeScript example with interfaces
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

class ShoppingCart {
  private items: Product[] = [];
  
  addItem(product: Product): void {
    this.items.push(product);
  }
  
  getTotal(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
  getItemCount(): number {
    return this.items.length;
  }
}

// Usage
const cart = new ShoppingCart();
cart.addItem({
  id: "p1",
  name: "Product 1",
  price: 29.99,
  quantity: 2
});

console.log(\`Total: $\${cart.getTotal().toFixed(2)}\`);
`;
