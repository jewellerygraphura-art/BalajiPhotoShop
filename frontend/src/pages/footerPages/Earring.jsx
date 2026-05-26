import React, { useState, useEffect } from "react";
import { axiosGetService } from "../../services/axios";
import CollectionPage from "../../components/collections/CollectionPage";
import toast, { Toaster } from "react-hot-toast";

const LIMIT = 9;

const EarringsListing = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchEarring = async (page = 1) => {
    try {
      setLoading(true);

      const apiResponse = await axiosGetService(
        `/customer/product/all?page=${page}&limit=${LIMIT}&category=Earrings`
      );

      if (!apiResponse.ok) {
        toast.error("Failed to load Earring.");
        return;
      }

      const { products, pagination } = apiResponse.data.data;

      setProducts(products); // replace for numbered pagination
      setPagination(pagination);
      setCurrentPage(page);

    } catch (error) {
      console.error("Failed to load Earring", error);
      toast.error("Something went wrong while fetching Earring.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarring(1);
  }, []);

  return (
    <>
      <Toaster />

      <CollectionPage
        title="Earring Collection"
        products={products}
        loading={loading}
        pagination={pagination}
        currentPage={currentPage}
        fetchProducts={fetchEarring}
      />
    </>
  );
};

export default EarringsListing;
