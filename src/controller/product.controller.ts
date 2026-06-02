import type { IncomingMessage, ServerResponse } from "http";
import { insertProducts, readProducts } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";

export const productController = async (
    req: IncomingMessage,
    res: ServerResponse,
) => {
    const url = req.url;
    const method = req.method;

    const urlParts = url?.split("/");
    const productId =
        urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;

    // get all products
    if (url === "/products" && method === "GET") {
        try {
            const products = readProducts();

            return sendResponse(res, 200, true, "Products retrieved successfully", products);
        } catch (error) {
            return sendResponse(res, 500, false, "Something went wrong!", error);
        }
    } else if (method === "GET" && productId !== null) {
        // get single product
        try {
            const products = readProducts();
            const product = products.find((p: IProduct) => p.id === productId);
            
            if (!product) {
                return sendResponse(res, 404, false, "Product not found!");
            }

            return sendResponse(res, 200, true, "Product retrieved successfully", products);
        } catch (error) {
            return sendResponse(res, 500, false, "Something went wrong!", error);
        }
    } else if (method === "POST" && url === "/products") {
        // create product
        try {
            const body = await parseBody(req);
            const newProduct = {
                id: Date.now(),
                ...body,
            };

            const products = readProducts();
            products.push(newProduct);
            insertProducts(products);

            return sendResponse(res, 200, true, "Product created successfully", newProduct);
        } catch (error) {
            return sendResponse(res, 500, false, "Something went wrong!", error);
        }
    } else if (method === "PUT" && productId !== null) {
        // update a product
        try {
            const body = await parseBody(req);
            const products = readProducts();

            const index = products.findIndex((p: IProduct) => p.id === productId);
            if (index < 0) {
                return sendResponse(res, 404, false, "Product not found!");
            }

            products[index] = {
                id: products[index].id,
                ...body,
            };

            insertProducts(products);

            return sendResponse(res, 200, true, "Product updated successfully", products[index]);
        } catch (error) {
            return sendResponse(res, 500, false, "Something went wrong!", error);
        }
    } else if (method === "DELETE" && productId !== null) {
        // delete a product
        try {
            const products = readProducts();

            const index = products.findIndex((p: IProduct) => p.id === productId);
            if (index < 0) {
                return sendResponse(res, 404, false, "Product not found!");
            }

            products.splice(index, 1);
            insertProducts(products);

            return sendResponse(res, 200, true, "Product deleted successfully", products);
        } catch (error) {
            return sendResponse(res, 500, false, "Something went wrong!", error);
        }
    }
};
