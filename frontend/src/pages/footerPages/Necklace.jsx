import React, { useState, useEffect } from "react";
import { axiosGetService } from "../../services/axios";
import CollectionPage from "../../components/collections/CollectionPage";
import toast, { Toaster } from "react-hot-toast";

const LIMIT = 9;

const NecklacesListing = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchNecklaces = async (page = 1) => {
    try {
      setLoading(true);

      const apiResponse = await axiosGetService(
        `/customer/product/all?page=${page}&limit=${LIMIT}&category=Necklace`
      );

      if (!apiResponse.ok) {
        toast.error("Failed to load necklaces.");
        return;
      }

      const { products, pagination } = apiResponse.data.data;

      setProducts(products); // replace for numbered pagination
      setPagination(pagination);
      setCurrentPage(page);

    } catch (error) {
      console.error("Failed to load necklaces", error);
      toast.error("Something went wrong while fetching necklaces.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNecklaces(1);
  }, []);

  return (
    <>
      <Toaster />

      <CollectionPage
        title="Necklace Collection"
        products={products}
        loading={loading}
        pagination={pagination}
        currentPage={currentPage}
        fetchProducts={fetchNecklaces}
      />
    </>
  );
};

export default NecklacesListing;
