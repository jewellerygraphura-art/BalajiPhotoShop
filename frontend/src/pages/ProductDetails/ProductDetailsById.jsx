import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfilePic from "../../assets/NewArrivalAssets/logos/ProfilePic.jpg";
import { axiosGetService } from "../../services/axios";
import {
    Star,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    Share2,
    ArrowLeft,
    Heart,
    ChevronDown,
    Check,
} from "lucide-react";
import ProductCard from "../../components/products/ProductCard";
import FeatureCard from "../../components/common/FeatureCard";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useParams } from "react-router-dom";
import shippingIcon from "../../assets/NewArrivalAssets/logos/la_shipping-fast.png";
import paymentIcon from "../../assets/NewArrivalAssets/logos/fluent_payment-32-regular.png";
import supportIcon from "../../assets/NewArrivalAssets/logos/streamline-plump_customer-support-7.png";

import axios from "axios";
// import { axiosPostService} from "../../services/axios";

const ProductDetailsById = () => {
    const [mainImage, setMainImage] = useState(0);
    const [selectPurity, setSelectPurity] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    //   const { product, allproducts } = location.state || {};

    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    const [reviewRating, setReviewRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewComment, setReviewComment] = useState("");
    const [reviewerName, setReviewerName] = useState("");
    const [reviewerEmail, setReviewerEmail] = useState("");
    const [reviews, setReviews] = useState([]);

    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("Description");
    const [selectedPurity, setSelectedPurity] = useState("18 KT");
    const [showAddedToCart, setShowAddedToCart] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(false);
    const [isApprovedB2B, setIsApprovedB2B] = useState(false);

    const selectedVariant = product?.variants?.[selectPurity];

    const favorited = product
        ? isFavorite(product._id, selectedVariant?.purity)
        : false;

    //  const handleAddToCart = () => {
    //   if (product) {
    //     const purity = product.variants[selectPurity].purity;

    //     addToCart(product, quantity, purity);

    //     setShowAddedToCart(true);
    //     setTimeout(() => setShowAddedToCart(false), 2000);
    //   }
    // };


    //   const handleBuyNow = () => {
    //     if (product) {
    //       const productWithPrice = {
    //         ...product,
    //         price: {
    //           sale: product.variants[selectPurity].sale,
    //           mrp: product.variants[selectPurity].price,
    //         },
    //       };

    //       addToCart(product, quantity, purity);
    //       navigate("/cart");
    //     }
    //   };

    const { id } = useParams();


    const fetchProduct = async () => {
        try {
            const apiResponse = await axios.get(
                `/api/v1/customer/product/productId/${id}`
            );

            console.log(apiResponse.data.data)

            setProduct(apiResponse.data.data);

        } catch (err) {
            console.error("Error fetching product:", err.message);
        }
    };


    useEffect(() => {
        fetchProduct();
        
        // Fetch and verify B2B Wholesale status
        const verifyB2B = async () => {
            try {
                const res = await axiosGetService("/customer/auth/myProfile");
                if (res.ok && res.data?.data) {
                    const user = res.data.data;
                    if (user.userType === "B2B" && user.businessDetails?.isApproved) {
                        setIsApprovedB2B(true);
                    }
                }
            } catch (err) {
                console.error("B2B Verification Failed:", err);
            }
        };
        verifyB2B();
    }, [id]);

    useEffect(() => {
        if (product && isApprovedB2B && product.b2bMoq) {
            setQuantity(product.b2bMoq);
        } else {
            setQuantity(1);
        }
    }, [product, isApprovedB2B]);


    useEffect(() => {
        if (!product?._id) return;

        const fetchReviews = async () => {
            try {
                const res = await axios.get(
                    `/api/v1/customer/product/${product._id}/reviews`
                );

                const data = Array.isArray(res.data) ? res.data : [];
                setReviews(data);

                // update review count label
                product.reviews = data.length;
            } catch (err) {
                console.error(err);
                setReviews([]);
            }
        };

        fetchReviews();
    }, [product?._id]);

    useEffect(() => {
        if (!product?._id) return;

        const fetchRelatedProducts = async () => {
            try {
                setRelatedLoading(true);

                const category = encodeURIComponent(product.category || "");
                const collectionName = encodeURIComponent(product.productCollection || "");

                const requests = [
                    axiosGetService(`/customer/product/all?page=1&limit=12&category=${category}`),
                    collectionName
                        ? axiosGetService(`/customer/product/all?page=1&limit=12&collectionName=${collectionName}`)
                        : Promise.resolve(null),
                    axiosGetService(`/customer/product/all?page=1&limit=12`),
                ];

                const responses = await Promise.all(requests);

                const merged = responses
                    .filter(Boolean)
                    .flatMap((res) => (res?.ok ? res?.data?.data?.products || [] : []));

                const uniqueMap = new Map();

                merged.forEach((item) => {
                    if (!item?._id || item._id === product._id) return;
                    if (!uniqueMap.has(item._id)) {
                        uniqueMap.set(item._id, item);
                    }
                });

                setRelatedProducts(Array.from(uniqueMap.values()).slice(0, 8));
            } catch (err) {
                console.error("Related product fetch error:", err);
                setRelatedProducts([]);
            } finally {
                setRelatedLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [product?._id, product?.category, product?.productCollection]);


    const handleAddToCart = () => {
        if (!product) return;
        if (isApprovedB2B && product.b2bMoq && quantity < product.b2bMoq) {
            alert(`Minimum order quantity for this product is ${product.b2bMoq} units.`);
            return;
        }
        const selectedVariant = product.variants[selectPurity];

        if (!selectedVariant || selectedVariant.quantity <= 0) {
            alert("Selected purity is out of stock");
            return;
        }

        if (quantity > selectedVariant.quantity) {
            alert(`Only ${selectedVariant.quantity} quantity available`);
            return;
        }

        addToCart(product, quantity, selectedVariant.purity);
        setShowAddedToCart(true);
        setTimeout(() => setShowAddedToCart(false), 2000);
    };


    const handleBuyNow = () => {
        if (!product) return;
        if (isApprovedB2B && product.b2bMoq && quantity < product.b2bMoq) {
            alert(`Minimum order quantity for this product is ${product.b2bMoq} units.`);
            return;
        }
        const selectedVariant = product.variants[selectPurity];

        if (!selectedVariant || selectedVariant.quantity <= 0) {
            alert("Selected purity is out of stock");
            return;
        }

        if (quantity > selectedVariant.quantity) {
            alert(`Only ${selectedVariant.quantity} quantity available`);
            return;
        }

        addToCart(product, quantity, selectedVariant.purity);
        navigate("/cart");
    };


    if (!product) {
        return (
            <div className="text-center py-20 bg-[#FFF9E9] min-h-screen">
                <h2 className="text-2xl font-serif text-[#1C3A2C]">Product not found!</h2>
                <button
                    onClick={() => navigate("/collections")}
                    className="mt-4 underline text-[#B39055]"
                >
                    Go back
                </button>
            </div>
        );
    }

    const tabs = ["Description", "Additional Information", "Review"];

    //   const relatedProducts = Array.isArray(allproducts)
    //     ? allproducts.filter(
    //       (p) => p.category === product.category && p._id !== product._id
    //     )
    //     : [];

    const RatingBar = ({ stars, percentage }) => (
        <div className="flex items-center gap-4 text-xs font-bold text-[#1C3A2C]">
            <span className="w-10 whitespace-nowrap">{stars} Star</span>
            <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-gray-100">
                <div
                    className="h-full bg-[#CBA135]"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );

    const submitReview = async (e) => {
        e.preventDefault();

        if (!reviewRating || !reviewComment || !reviewerName || !reviewTitle) {
            alert("Please fill all required fields");
            return;
        }

        try {
            const res = await axios.post(
                `/api/v1/customer/product/review?productId=${product._id}`,
                {
                    name: reviewerName,
                    email: reviewerEmail,
                    rating: reviewRating,
                    title: reviewTitle,
                    comment: reviewComment,
                },
                { withCredentials: true }
            );

            let newReview =
                res.data.review || res.data.data || res.data.reviewData || res.data;

            if (!newReview || typeof newReview !== "object") {
                console.warn("Unexpected POST response:", res.data);
                return;
            }

            setReviews((prev) => [newReview, ...prev]);
            product.reviews = reviews.length + 1;

            setReviewerName("");
            setReviewerEmail("");
            setReviewRating(0);
            setReviewTitle("");
            setReviewComment("");

            alert("Review added successfully!");
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || "Failed to add review");
        }
    };


    const capitalizeWords = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

    return (
        <div className="bg-[#FFF9E9] min-h-screen font-sans text-[#1C3A2C]">
            <nav className="max-w-[1440px] mx-auto px-2 sm:px-12 py-2 flex items-center justify-between">
                <div className="text-xs sm:text-sm text-gray-500">
                    Home / Collection /{" "}
                    <span className="text-[#B39055]">{product.name}</span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-semibold hover:text-[#B39055] transition-colors"
                >
                    <ArrowLeft size={18} /> Back
                </button>
            </nav>

            <main className="max-w-[1440px] mx-auto px-2 sm:px-12 py-0">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-[40%] space-y-4">
                        <div className="relative aspect-square bg-white rounded-lg overflow-hidden group">
                            <img
                                src={product.productImage[mainImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();

                                    if (!product || !selectedVariant) return;

                                    const favoriteProduct = {
                                        ...product,
                                        price: {
                                            sale: selectedVariant.sale,
                                            mrp: selectedVariant.price
                                        }
                                    };

                                    toggleFavorite(favoriteProduct, selectedVariant.purity);
                                }}
                                className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow hover:scale-110 transition"
                            >
                                <Heart
                                    size={16}
                                    className={favorited ? "fill-red-500 text-red-500" : "text-[#08221B]"}
                                />
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {product.productImage.slice(0, 4).map((image, index) => (
                                <div
                                    key={index}
                                    className="aspect-square bg-white rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#B39055]"
                                >
                                    <img
                                        src={image}
                                        alt="thumbnail"
                                        className="w-full h-full object-cover"
                                        onClick={() => setMainImage(index)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 space-y-6">
                        <div>
                            <p className="text-[#1C3A2C] font-serif text-lg mb-[-10px]">
                                {product.category}
                            </p>
                            <div className="flex justify-between items-start">
                                <h1 className="text-[42px] font-medium font-serif text-[#1C3A2C] leading-tight">
                                    {capitalizeWords(product.name)}
                                </h1>
                                <span className="bg-[#a4dfc5] text-[#1C3A2C] px-4 py-2 text-xs rounded border-2 border-[#74B397] mt-5">
                                    {product.stockStatus}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex text-[#CBA135]">
                                    {[...Array(Math.round(product.rating.avg))].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>

                                <span className="text-gray-500 text-sm">
                                    ({Array.isArray(product.reviews) ? product.reviews.length : product.reviews} reviews)
                                </span>
                            </div>
                        </div>

                        {isApprovedB2B && product.b2bPrice?.sale ? (
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#CBA135] text-white px-2.5 py-1 rounded-sm shadow-sm">Wholesale Partner Price</span>
                                    {product.b2bMoq > 1 && <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1E3A2F] text-white px-2.5 py-1 rounded-sm shadow-sm">Min Order Qty: {product.b2bMoq}</span>}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[25px] font-bold text-[#CBA135]">₹{product.b2bPrice.sale.toLocaleString()}</span>
                                    <span className="line-through text-lg text-[#37654B]">₹{(product.b2bPrice.mrp || product.variants[selectPurity].price).toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-500 italic">Standard retail price: ₹{product.variants[selectPurity].sale.toLocaleString()}</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-[25px] font-bold text-[#1C3A2C]">
                                    ₹{product.variants[selectPurity].sale.toLocaleString()}
                                </span>
                                <span className="line-through text-lg text-[#37654B]">
                                    ₹{product.variants[selectPurity].price.toLocaleString()}
                                </span>
                            </div>
                        )}

                        <p className="text-gray-600 leading-relaxed">
                            {/* The {product.name} is a refined gold creation designed to add
              effortless luxury and timeless charm to every moment.{" "} */}
                            {product.additionalInfo}
                        </p>

                        <div className="space-y-3">
                            <p className="font-semibold text-sm uppercase tracking-wider">
                                Purity
                            </p>
                            <div className="flex gap-3">
                                {product.variants.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedPurity(item.purity);
                                            setSelectPurity(index);
                                        }}
                                        className={`px-4 py-2 border text-sm transition-all ${index === selectPurity
                                            ? "border-[#1C3A2C] bg-[#1C3A2C] text-white"
                                            : "border-gray-300 hover:border-[#1C3A2C]"
                                            }`}
                                    >
                                        {String(item.purity)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <div className="flex items-center border border-gray-300 rounded bg-white">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(isApprovedB2B && product.b2bMoq ? product.b2bMoq : 1, q - 1))}
                                    className="p-3 hover:bg-gray-100 transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="px-6 font-bold min-w-[3rem] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="p-3 hover:bg-gray-100 transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#195C4A] text-white py-4 px-8 uppercase tracking-widest font-bold hover:bg-black transition-all relative"
                            >
                                {showAddedToCart ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Check size={18} /> Added!
                                    </span>
                                ) : (
                                    "Add To Cart"
                                )}
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="flex-1 border-2 border-[#1C3A2C] text-[#1C3A2C] py-4 px-8 uppercase tracking-widest font-bold hover:bg-[#195C4A] hover:text-white transition-all"
                            >
                                Buy Now
                            </button>
                        </div>

                        <div className="pt-6 border-t-2 border-[#6E6E6E] text-sm space-y-2 text-gray-500 mt-10">
                            <p>
                                <span className="text-[#1C3A2C] font-semibold">SKU :</span>{" "}
                                {product.sku}
                            </p>
                            <p>
                                <span className="text-[#1C3A2C] font-semibold">Category :</span>
                                {product.category}
                            </p>
                            {/* <p>
                                <span className="text-[#1C3A2C] font-semibold">Tags :</span>
                                {product.tags.map((tag, i) => (
                                    <span key={i}>{tag} </span>
                                ))}
                            </p> */}
                            <div className="flex items-center gap-2">
                                <span className="text-[#1C3A2C] font-semibold">Share :</span>
                                <Share2
                                    size={16}
                                    className="cursor-pointer hover:text-[#B39055] transition-colors"
                                    onClick={() => {
                                        if (navigator.share) {
                                            const customUrl = `${window.location.origin}/productId/${product._id}`;
                                            console.log("Generated URL:", customUrl);

                                            navigator.share({
                                                title: product.name,
                                                text: `Check out ${product.name} at Balaji Gift Store`,
                                                url: customUrl
                                            });
                                        } else {
                                            alert("Sharing not supported in this browser");
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {showAddedToCart && (
                    <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slideIn">
                        <Check size={20} />
                        <span>Added to cart successfully!</span>
                    </div>
                )}

                <div className="mt-20">
                    <div className="flex justify-center border-b border-gray-200 gap-8 sm:gap-16">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-lg font-serif transition-all relative ${activeTab === tab ? "text-[#1C3A2C]" : "text-gray-400"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1C3A2C]" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="py-10 max-w-5xl mx-auto">
                        {activeTab === "Description" && (
                            <div className="text-gray-600 leading-loose text-lg font-serif text-center space-y-6">
                                <p>{product.description}</p>
                                <p>
                                    Created with heritage precision and care, these handcrafted items embody Balaji Gift Store's commitment to cultural preservation, premium quality, and beautiful lifelong memories.
                                </p>
                            </div>
                        )}

                        {activeTab === "Additional Information" && (
                            <div className="max-w-4xl mx-auto border border-gray-100 shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#1C3A2C] text-white">
                                            <th className="py-4 px-6 font-serif font-normal">
                                                Feature
                                            </th>
                                            <th className="py-4 px-6 font-serif font-normal">
                                                Description
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr className="bg-white">
                                            <td className="py-4 px-6 font-bold border-r border-gray-50">
                                                Material
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {product.attributes.material}
                                            </td>
                                        </tr>
                                        <tr className="bg-[#F9F4E8]">
                                            <td className="py-4 px-6 font-bold border-r border-gray-50">
                                                Gemstones
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {product.attributes.gemstone}
                                            </td>
                                        </tr>
                                        <tr className="bg-white">
                                            <td className="py-4 px-6 font-bold border-r border-gray-50">
                                                Purity
                                            </td>
                                            <td className="p-4 px-6 text-gray-600">
                                                {product.variants.map((item, i) => (
                                                    <span key={i}>{String(item.purity)} </span>
                                                ))}
                                            </td>
                                        </tr>
                                        <tr className="bg-[#F9F4E8]">
                                            <td className="py-4 px-6 font-bold border-r border-gray-50">
                                                Weight
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {product.variants.map((item, i) => (
                                                    <span key={i}>{`${String(item.weight)}g`} </span>
                                                ))}
                                            </td>
                                        </tr>
                                        <tr className="bg-white">
                                            <td className="py-4 px-6 font-bold border-r border-gray-50">
                                                Brand
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {product.brand}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "Review" && (
                            <div className="space-y-12">
                                <div className="flex flex-col md:flex-row gap-8 items-start border-b border-gray-100 pb-10">
                                    <div className="text-center md:text-left md:border-r border-gray-200 pr-12">
                                        <div className="text-5xl font-bold text-[#1C3A2C]">
                                            {product.rating.avg}
                                            <span className="text-lg font-normal text-gray-400">
                                                {" "}
                                                out of 5
                                            </span>
                                        </div>
                                        <div className="flex text-[#CBA135] my-2 justify-center md:justify-start">
                                            {[...Array(Math.round(product.rating.avg))].map((_, i) => (
                                                <Star key={i} size={20} fill="currentColor" />
                                            ))}
                                        </div>
                                        <p className="text-gray-400 text-xs">{reviews.length} reviews</p>
                                    </div>

                                    <div className="flex-1 space-y-2 w-full max-w-md">
                                        <RatingBar stars={5} percentage={80} />
                                        <RatingBar stars={4} percentage={65} />
                                        <RatingBar stars={3} percentage={45} />
                                        <RatingBar stars={2} percentage={25} />
                                        <RatingBar stars={1} percentage={10} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-serif text-[#1C3A2C]">
                                            Review List
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>Showing 1-4 of {reviews.length} results</span>
                                            <div className="flex items-center gap-1 border border-gray-200 rounded px-2 py-1 bg-[#F5EFE0] cursor-pointer">
                                                <span>Sort by:</span>
                                                <span className="font-bold">Newest</span>
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        {reviews.length === 0 && (
                                            <p className="text-gray-400 text-sm">No reviews yet.</p>
                                        )}

                                        {reviews.map((rev) => {
                                            if (!rev || typeof rev !== "object") return null;

                                            return (
                                                <div key={rev._id} className="border-b pb-6 mb-6">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={
                                                                    rev.media?.[0] ||
                                                                    ProfilePic
                                                                }
                                                                className="w-10 h-10 rounded-full"
                                                                alt="user"
                                                            />
                                                            <p className="font-semibold text-sm">
                                                                {rev.name || "Anonymous"}
                                                            </p>
                                                        </div>

                                                        <span className="text-xs text-gray-400">
                                                            {rev.createdAt
                                                                ? new Date(
                                                                    rev.createdAt
                                                                ).toLocaleDateString()
                                                                : ""}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-[#CBA135] mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i}>
                                                                {i < (rev.rating || 0) ? "★" : "☆"}
                                                            </span>
                                                        ))}
                                                        <span className="text-xs text-gray-600 ml-1">
                                                            {(rev.rating || 0).toFixed(1)}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm text-gray-700">
                                                        {rev.comment || ""}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-10">
                                    <h3 className="text-xl font-serif text-[#1C3A2C] mb-1">
                                        Add your review
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-8">
                                        Let us know your thoughts.
                                    </p>

                                    <form className="space-y-6" onSubmit={submitReview}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold">Name*</label>
                                                <input
                                                    type="text"
                                                    value={reviewerName}
                                                    onChange={(e) =>
                                                        setReviewerName(e.target.value)
                                                    }
                                                    placeholder="Ex. John Kapoor"
                                                    className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#1C3A2C]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold">Email*</label>
                                                <input
                                                    type="email"
                                                    value={reviewerEmail}
                                                    onChange={(e) =>
                                                        setReviewerEmail(e.target.value)
                                                    }
                                                    placeholder="example@gmail.com"
                                                    className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#1C3A2C]"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold">
                                                Your Rating*
                                            </label>
                                            <div className="flex text-[#CBA135] gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={18}
                                                        onClick={() =>
                                                            setReviewRating(i + 1)
                                                        }
                                                        fill={
                                                            i < reviewRating
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                        className="cursor-pointer"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold">
                                                Review Title*
                                            </label>
                                            <input
                                                type="text"
                                                value={reviewTitle}
                                                onChange={(e) =>
                                                    setReviewTitle(e.target.value)
                                                }
                                                placeholder="Write Review Title here"
                                                className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#1C3A2C]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold">
                                                Detailed Review*
                                            </label>
                                            <textarea
                                                rows="4"
                                                value={reviewComment}
                                                onChange={(e) =>
                                                    setReviewComment(e.target.value)
                                                }
                                                placeholder="Write here"
                                                className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#1C3A2C] resize-none"
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="bg-[#1C3A2C] text-white px-10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors rounded"
                                        >
                                            Submit
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="py-20">
                    <p className="text-md tracking-widest text-[#CBA135] mb-2 text-center">
                        RELATED PRODUCT
                    </p>

                    <h1 className="text-xl sm:text-3xl font-serif text-[#1C3A2C] mb-10 text-center">
                        Explore Related Products
                    </h1>

                    {relatedLoading && (
                        <p className="text-center text-sm text-gray-500">Loading related products...</p>
                    )}

                    {!relatedLoading && relatedProducts.length === 0 && (
                        <p className="text-center text-sm text-gray-500">No related products found right now.</p>
                    )}

                    {!relatedLoading && relatedProducts.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                            {relatedProducts.map((item) => (
                                <ProductCard key={item._id} product={item} />
                            ))}
                        </div>
                    )}
                </div>

                <section className="bg-[#FFF9E9] px-4 sm:px-6 lg:px-12 xl:px-16 py-10 lg:py-16">
                    <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <FeatureCard
                            icon={shippingIcon}
                            title="Free Shipping"
                            description="Free Shipping for Order above ₹ 2,000"
                        />
                        <FeatureCard
                            icon={paymentIcon}
                            title="Flexible Payment"
                            description="Multiple Secure payment Options"
                        />
                        <FeatureCard
                            icon={supportIcon}
                            title="24x7 Support"
                            description="We Support online all days"
                        />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProductDetailsById;
