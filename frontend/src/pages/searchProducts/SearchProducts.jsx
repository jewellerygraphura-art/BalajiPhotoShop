import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CollectionPage from "../../components/collections/CollectionPage";
import { axiosGetService } from "../../services/axios";

const SearchProducts = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    (async () => {
      setLoading(true);

      // 🔽 ONLY CHANGE: correct search API path
      const res = await axiosGetService(
        `/common/search?q=${query}`
      );

      if (!res.ok) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const data = res.data?.data;
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, [query]);

  if (loading) {
    return (
      <div className="pt-32 text-center text-lg">
        Searching products...
      </div>
    );
  }

  return (
    <CollectionPage
      title={`Search results for "${query}"`}
      products={products}
    />
  );
};

export default SearchProducts;
