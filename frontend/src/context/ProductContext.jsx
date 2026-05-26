import { createContext, useState, useCallback } from "react";
import { axiosGetService } from "../services/axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const LIMIT = 9;

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCollection, setCurrentCollection] = useState("");
  const [currentGender, setCurrentGender] = useState("");
  const [loading, setLoading] = useState(false);

  const requestProducts = useCallback(async ({ page = 1, collectionName = "", gender = "", category = "" }) => {
    let url = `/customer/product/all?page=${page}&limit=${LIMIT}`;

    if (collectionName) {
      url += `&collectionName=${encodeURIComponent(collectionName)}`;
    }

    if (gender) {
      url += `&productFor=${encodeURIComponent(gender)}`;
    }

    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const res = await axiosGetService(url);

    if (!res?.ok || !res?.data?.data) {
      return null;
    }

    const { products, pagination } = res.data.data;
    return {
      products: products || [],
      pagination: pagination || null,
    };
  }, []);

  const fetchProducts = useCallback(
    async (page = 1, collectionName = undefined, gender = undefined, category = undefined) => {
      try {
        setLoading(true);

        let activeCollection = currentCollection;
        let activeGender = currentGender;


        if (collectionName !== undefined) {
          activeCollection = collectionName;
          setCurrentCollection(collectionName);
          setCurrentGender("");   
          activeGender = "";
          page = 1;
        }

        if (gender !== undefined) {
          activeGender = gender;
          setCurrentGender(gender);
          setCurrentCollection("");  
          activeCollection = "";
          page = 1;
        }

        const result = await requestProducts({
          page,
          collectionName: activeCollection,
          gender: activeGender,
          category: category || ""
        });

        if (result) {
          setProducts(result.products);
          setPagination(result.pagination);
          setCurrentPage(page);
          return result;
        }

        return null;

      } catch (error) {
        console.error("Product fetch error:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentCollection, currentGender, requestProducts]
  );

  const fetchCollectionWithFallback = useCallback(
    async ({
      page = 1,
      primaryCollection = "",
      fallbackCollections = [],
      fallbackCategory = "Rings"
    }) => {
      setLoading(true);
      try {
        const collectionCandidates = [
          primaryCollection,
          ...fallbackCollections
        ]
          .map((item) => (item || "").trim())
          .filter(Boolean);

        for (const collectionCandidate of collectionCandidates) {
          const result = await requestProducts({ page, collectionName: collectionCandidate });

          if (result && result.products.length > 0) {
            setProducts(result.products);
            setPagination(result.pagination);
            setCurrentPage(page);
            setCurrentCollection(collectionCandidate);
            setCurrentGender("");
            return result;
          }
        }

        if (fallbackCategory) {
          const categoryResult = await requestProducts({ page, category: fallbackCategory });

          if (categoryResult) {
            setProducts(categoryResult.products);
            setPagination(categoryResult.pagination);
            setCurrentPage(page);
            setCurrentCollection("");
            setCurrentGender("");
            return categoryResult;
          }
        }

        setProducts([]);
        setPagination(null);
        setCurrentPage(page);
        return null;
      } catch (error) {
        console.error("Collection fallback fetch error:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [requestProducts]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        pagination,
        currentPage,
        fetchProducts,
        fetchCollectionWithFallback,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
