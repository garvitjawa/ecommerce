import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import apiService from '../services/api';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await apiService.getProducts();
      setProducts(productsData as Product[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value: ProductsContextType = {
    products,
    loading,
    error,
    fetchProducts,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
