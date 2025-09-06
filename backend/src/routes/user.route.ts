import BaseRoute from './base.route';
import { Request, Response } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';
import { IUser } from '../model/user.model';

export class UserRoutes extends BaseRoute {
  constructor() {
    super();
    this.userRoutes();
  }
  private userRoutes(): void {
    this.router.get(
      '/getCart',
      AuthMiddleware.authenticate,
      (req: any, res: Response) => {
        const user = req.user as IUser;
        const cart = user.cart;
        res.json(cart);
      },
    );
    this.router.post(
      '/addToCart',
      AuthMiddleware.authenticate,
      (req: any, res: Response) => {
        const user = req.user as IUser;
        const { productId } = req.body;
        if (!productId) {
          return res.status(400).send('Product ID is required');
        }

        // Convert productId to number (it's now an index)
        const productIndex = parseInt(productId);
        if (isNaN(productIndex) || productIndex < 0) {
          return res.status(400).send('Invalid product ID');
        }

        const cart = [...user.cart]; // Create a new array
        // Find existing item by productId (stored as string)
        const itemIndex = cart.findIndex(
          (item) => item.productId === productId,
        );

        if (itemIndex > -1) {
          // Item exists, increment quantity
          cart[itemIndex].quantity += 1;
        } else {
          // Item doesn't exist, add new item with the string productId
          cart.push({ productId, quantity: 1 });
        }

        user.cart = cart;
        user.markModified('cart'); // Tell Mongoose that cart has been modified
        user
          .save()
          .then(() => {
            res.status(200).send('Product added to cart');
          })
          .catch((err) => {
            res.status(500).send('Error adding to cart: ' + err.message);
          });
      },
    );
    this.router.delete(
      '/removeFromCart',
      AuthMiddleware.authenticate,
      (req: any, res: Response) => {
        const user = req.user as IUser;
        const { productId } = req.body;
        if (!productId) {
          return res.status(400).send('Product ID is required');
        }

        // Convert productId to number (it's now an index)
        const productIndex = parseInt(productId);
        if (isNaN(productIndex) || productIndex < 0) {
          return res.status(400).send('Invalid product ID');
        }

        const cart = [...user.cart]; // Create a new array
        const itemIndex = cart.findIndex(
          (item) => item.productId === productId,
        );
        if (itemIndex > -1) {
          cart[itemIndex].quantity -= 1;
          if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
          }
        } else {
          return res.status(404).send('Product not found in cart');
        }
        user.cart = cart;
        user.markModified('cart'); // Tell Mongoose that cart has been modified
        user
          .save()
          .then(() => {
            res.status(200).send('Product removed from cart');
          })
          .catch((err) => {
            res.status(500).send('Error removing from cart: ' + err.message);
          });
      },
    );
    this.router.get(
      '/getAllProducts',
      AuthMiddleware.authenticate,
      (req: any, res: Response) => {
        const products = [
          {
            id: 'prod1',
            name: 'Wireless Headphones',
            price: 59.99,
            image:
              'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', // Relevant
          },
          {
            id: 'prod2',
            name: 'Smartwatch',
            price: 129.99,
            image:
              'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=800', // Smartwatch
          },
          {
            id: 'prod3',
            name: 'Running Shoes',
            price: 89.99,
            image:
              'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800', // Relevant
          },
          {
            id: 'prod4',
            name: 'Gaming Keyboard',
            price: 74.99,
            image:
              'https://images.unsplash.com/photo-1626155399627-86488538895d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Gaming Keyboard
          },
          {
            id: 'prod5',
            name: 'Backpack',
            price: 49.99,
            image:
              'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          },
        ];

        res.json(products);
      },
    );
  }
}
export default new UserRoutes().router;
