import auth_Model from "../../models/admin/user.models.js";
import customerModel from "../../models/customer/user.model.js";
import Order from "../../models/order/Order.js";
import Address from "../../models/order/Address.js";
import wishlistModel from "../../models/customer/wishList.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { encryptPasswordMethod, decryptPasswordMethod } from "../../utils/passwordEncrypt&passwordDecrypt.js";
import cookiesForUser from "../../utils/cookiesForUser.js";
import { cloudinary, deleteFromCloudinary } from "../../configs/cloudinary.js";

const rebuildAdminContactIndex = async () => {
    try {
        await auth_Model.collection.dropIndex("contact_1");
    }
    catch (indexErr) {
        // Ignore if index does not exist or cannot be dropped.
    }

    await auth_Model.collection.createIndex(
        { contact: 1 },
        { unique: true, sparse: true, name: "contact_1" }
    );
}

const Signup = async (req, res) => {
    try {
        const { name, email, password, securityKey } = req.body;

        if (securityKey !== process.env.securitykey) {
            return res.status(401).json(new ApiError(401, "Incorrect Security Key."))
        }


        const adminDetail = auth_Model({
            email: email,
            password: await encryptPasswordMethod(password),
            name: name,
            profileImage: null,
        });

        await adminDetail.save();

        adminDetail.password = undefined;
        adminDetail.contact = undefined;
        adminDetail.profileImage = undefined

        const adminResponse = adminDetail.toObject();
        adminResponse.role = "admin";

        await cookiesForUser(res, adminResponse)

        return res.status(200).json(new ApiResponse(200, null, "Registration Successful"));
    }
    catch (err) {
        const isLegacyContactDuplicate =
            err?.code === 11000 &&
            (err?.keyPattern?.contact === 1 || `${err?.message || ""}`.includes("contact_1"));

        if (isLegacyContactDuplicate) {
            try {
                await rebuildAdminContactIndex();

                const { name, email, password } = req.body;
                const retryAdminDetail = auth_Model({
                    email,
                    password: await encryptPasswordMethod(password),
                    name,
                    profileImage: null,
                });

                await retryAdminDetail.save();

                retryAdminDetail.password = undefined;
                retryAdminDetail.contact = undefined;
                retryAdminDetail.profileImage = undefined;

                const retryAdminResponse = retryAdminDetail.toObject();
                retryAdminResponse.role = "admin";

                await cookiesForUser(res, retryAdminResponse);

                return res.status(200).json(new ApiResponse(200, null, "Registration Successful"));
            }
            catch (retryErr) {
                return res.status(500).json(
                    new ApiError(500, "Admin registration failed while repairing contact index", [{ message: retryErr.message, name: retryErr.name }])
                );
            }
        }

        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let adminDetail = await auth_Model.findOne({ email: email });

        const decryptPassword = await decryptPasswordMethod(password, adminDetail.password);

        if (!decryptPassword) {
            return res.status(401).json(new ApiError(401, "Incorrect Password"));
        }

        adminDetail.password = undefined;
        adminDetail.contact = undefined;
        adminDetail.profileImage = undefined;

        const adminResponse = adminDetail.toObject();
        adminResponse.role = "admin";


        await cookiesForUser(res, adminResponse)
        return res.status(200).json(new ApiResponse(200, null, "Access Granted"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const ForgotPassword = async (req, res) => {
    try {
        const { email, password, securityKey } = req.body;

        if (securityKey !== process.env.securitykey) {
            return res.status(401).json(new ApiError(401, "Incorrect Security Key."))
        }

        let adminDetail = await auth_Model.findOneAndUpdate(
            { email: email },
            {
                password: await encryptPasswordMethod(password)
            }
        );

        adminDetail.password = undefined;
        adminDetail.contact = undefined;
        adminDetail.profileImage = undefined

        const adminResponse = adminDetail.toObject();
        adminResponse.role = "admin";

        await cookiesForUser(res, adminResponse)

        return res.status(200).json(new ApiResponse(200, null, "Password Change Successfully."));

    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const changePassword = async (req, res) => {
    try {

        const { oldPassword, newPassword } = req.body;

        const { _id, role } = req.user;

        if (!role) {
            return res.status(401).json(new ApiError(401, "Not Auth"));
        }

        const adminDetail = await auth_Model.findById(_id);

        const decryptPassword = await decryptPasswordMethod(oldPassword, adminDetail.password);

        if (!decryptPassword) {
            return res.status(401).json(new ApiError(401, "Incorrect Old Password"));
        }

        await auth_Model.findByIdAndUpdate(
            { _id },
            { password: await encryptPasswordMethod(newPassword) }
        );

        return res.status(200).json(new ApiResponse(200, null, "Password Changes Successfully"));

    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const UpdateProfile = async (req, res) => {
    try {
        let { name, contact, gender } = req.body;
        const { _id, role } = req.user;

        if (!role) {
            return res.status(401).json(new ApiError(401, "Not Auth"));
        }

        const updateData = {};

        let userDetail = await auth_Model.findById(_id);

        if (userDetail.profileImage) {
            await deleteFromCloudinary(userDetail.profileImage);
        }

        let image = null;

        if (req.file) {
            image = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "image" },
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result.secure_url);
                    }
                );
                stream.end(req.file.buffer);
            });
        }



        if (req.file) updateData.profileImage = image;
        if (contact) updateData.contact = contact;
        if (gender) updateData.gender = gender;
        if (name) updateData.name = name;


        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No data provided to update"
            });
        }

        await auth_Model.findByIdAndUpdate(
            _id,
            { $set: updateData },
            { new: true }
        );

        return res.status(200).json(new ApiResponse(200, null, "Profile updated successfully"));

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.message }]));
    }
};

const myProfile = async (req, res) => {
    try {
        const { _id, role } = req.user;

        if (!role) {
            return res.status(401).json(new ApiError("Not Auth"));
        }

        const adminDetail = await auth_Model.findById(_id);

        adminDetail.password = undefined;

        return res.status(200).json(new ApiResponse(200, adminDetail, "SuccessFul"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getAllUsers = async (req, res) => {
    try {
        if (!req.user.role) {
            return res.status(401).json(new ApiError("Not Auth"));
        }

        let userData = await auth_Model.find({});

        if (userData.length === 0) {
            return res.status(404).json(new ApiError(404, "No Employee"));
        }

        return res.status(200).json(new ApiResponse(200, userData, "Successfull"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]))
    }
}

const getAllCustomers = async (req, res) => {
    try {
        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Not Auth"));
        }

        const page = Math.max(parseInt(req.query.page || "1", 10), 1);
        const limit = Math.max(parseInt(req.query.limit || "20", 10), 1);
        const search = (req.query.search || "").trim();

        const query = {};

        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [
                { firstName: regex },
                { lastName: regex },
                { email: regex }
            ];

            const numericSearch = Number(search);
            if (!Number.isNaN(numericSearch)) {
                query.$or.push({ contact: numericSearch });
            }
        }

        const totalCustomers = await customerModel.countDocuments(query);
        const customers = await customerModel
            .find(query)
            .select("firstName lastName email contact gender profileImage createdAt")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const customerIds = customers.map((customer) => customer._id);

        const orderStats = await Order.aggregate([
            { $match: { userId: { $in: customerIds } } },
            {
                $group: {
                    _id: "$userId",
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: "$total" }
                }
            }
        ]);

        const orderStatsMap = new Map(
            orderStats.map((item) => [item._id.toString(), item])
        );

        const enrichedCustomers = customers.map((customer) => {
            const stats = orderStatsMap.get(customer._id.toString());
            return {
                ...customer.toObject(),
                totalOrders: stats?.totalOrders || 0,
                totalSpent: stats?.totalSpent || 0
            };
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    customers: enrichedCustomers,
                    pagination: {
                        page,
                        limit,
                        totalCustomers,
                        totalPages: Math.ceil(totalCustomers / limit)
                    }
                },
                "Customers fetched successfully"
            )
        );
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const getCustomerDetails = async (req, res) => {
    try {
        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Not Auth"));
        }

        const { customerId } = req.params;

        const customer = await customerModel
            .findById(customerId)
            .select("firstName lastName email contact gender profileImage createdAt");

        if (!customer) {
            return res.status(404).json(new ApiError(404, "Customer not found"));
        }

        const [addresses, recentOrders, orderSummary] = await Promise.all([
            Address.find({ userId: customerId }).sort({ createdAt: -1 }),
            Order.find({ userId: customerId })
                .select("displayOrderId total orderStatus date address")
                .sort({ date: -1 })
                .limit(5),
            Order.aggregate([
                { $match: { userId: customer._id } },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalSpent: { $sum: "$total" }
                    }
                }
            ])
        ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    customer,
                    addresses,
                    recentOrders,
                    summary: {
                        totalOrders: orderSummary[0]?.totalOrders || 0,
                        totalSpent: orderSummary[0]?.totalSpent || 0
                    }
                },
                "Customer details fetched successfully"
            )
        );
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const deleteCustomer = async (req, res) => {
    try {
        if (!req.user.role) {
            return res.status(401).json(new ApiError(401, "Not Auth"));
        }

        const { customerId } = req.params;

        const customer = await customerModel.findById(customerId);

        if (!customer) {
            return res.status(404).json(new ApiError(404, "Customer not found"));
        }

        if (customer.profileImage) {
            await deleteFromCloudinary(customer.profileImage);
        }

        await Promise.all([
            customerModel.findByIdAndDelete(customerId),
            Address.deleteMany({ userId: customerId }),
            wishlistModel.deleteMany({ customerId })
        ]);

        return res.status(200).json(
            new ApiResponse(200, null, "Customer deleted successfully")
        );
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!req.user.role) {
            return res.status(401).json(new ApiError("Not Auth"));
        }

        let userData = await auth_Model.findByIdAndDelete(userId);

         if (userData.profileImage) {
            await deleteFromCloudinary(userData.profileImage);
        }

        if (!userData) {
            return res.status(404).json(new ApiError(404, "Employee Not find."))
        }

        return res.status(200).json(new ApiResponse(200, null, "Employee Delete Successfull"));
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]))
    }
}

const Signout = async (req, res) => {
    try {
        await res.clearCookie("AccessToken");
        await res.clearCookie("RefreshToken");

        return res.status(200).json(new ApiResponse(200, null, "Signout Successfully"))
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]))
    }
}

export { Signup, Login, ForgotPassword, changePassword, Signout, UpdateProfile, myProfile, getAllUsers, getAllCustomers, getCustomerDetails, deleteCustomer, deleteUser };