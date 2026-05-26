import React, { useState, useEffect } from "react";
import { axiosGetService } from "../../services/axios";
import CollectionPage from "../../components/collections/CollectionPage";
import toast, { Toaster } from "react-hot-toast";

const LIMIT = 9;

const RingsListing = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchRings = async (page = 1) => {
    try {
      setLoading(true);

      const apiResponse = await axiosGetService(
        `/customer/product/all?page=${page}&limit=${LIMIT}&category=Rings`
      );

      if (!apiResponse.ok) {
        toast.error("Failed to load Rings.");
        return;
      }

      const { products, pagination } = apiResponse.data.data;

      setProducts(products); // replace for numbered pagination
      setPagination(pagination);
      setCurrentPage(page);

    } catch (error) {
      console.error("Failed to load Rings", error);
      toast.error("Something went wrong while fetching Rings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRings(1);
  }, []);

  return (
    <>
      <Toaster />

      <CollectionPage
        title="Rings Collection"
        products={products}
        loading={loading}
        pagination={pagination}
        currentPage={currentPage}
        fetchProducts={fetchRings}
      />
    </>
  );
};

export default RingsListing;
