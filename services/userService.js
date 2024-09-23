
import { userStatus } from '../config/user.js';
import {UserModel} from '../models/index.js'
import ApiError from '../utils/APIError.js';
import httpStatus from 'http-status';
import { isValidObjectId } from '../utils/mongo.js';

const getUserFromId = async(userId) =>{
    const user = await UserModel.findById(userId).lean();
    if(!user)
        throw new ApiError("Invaid User Id")
    return user;
}
// Function to get paginated items
const getPaginatedUsers = async (page = 1, limit = 10) => {
    // Convert page and limit to integers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    // Calculate the number of items to skip
    const skip = (pageNumber - 1) * limitNumber;
    // Get the items with pagination
    const items = await UserModel.find()
      .skip(skip) // Skip the number of items based on the page
      .limit(limitNumber) // Limit the number of items per page
      .select( '-password')
      .exec(); // Execute the query
    const totalItems = await UserModel.countDocuments();
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limitNumber);
    // Return the paginated data
    return {
      items, // Paginated items
      totalItems, // Total number of items in the collection
      totalPages, // Total number of pages
      currentPage: pageNumber, // Current page
    };
};

const bulkUpdateUserStatus = async (userIds, newStatus) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new ApiError(400, 'User IDs must be an array with at least one ID');
  }
  // Validate that all IDs in the array are valid ObjectIds
  const areValidIds = userIds.every((id) => isValidObjectId(id));
  if(!areValidIds){
    throw new ApiError(400, `One or more invalid ObjectIds`);
  }

  // Check if the provided status is valid
  if (!userStatus.includes(newStatus)) {
    throw new ApiError(400, `Invalid status, available status: ${JSON.stringify(userStatus)}`);
  }

  // Perform the bulk update
  try {
    const result = await UserModel.updateMany(
      { _id: { $in: userIds } }, // Match the user IDs
      { $set: { status: newStatus } } // Set the new status
    );
    if (result.nModified === 0) {
      throw new ApiError(404, 'No users found to update');
    }
    return result;
  } catch(error) {
    throw new ApiError(500, 'Failed to update user status');
  }
}

const bulkDeleteUsersByIds = async (userIds) => {
  try {
    // Validate that all IDs in the array are valid ObjectIds
    const areValidIds = userIds.every((id) => isValidObjectId(id));
    if(!areValidIds){
      throw new ApiError(400, `One or more invalid ObjectIds`);
    }

    // Perform the bulk delete operation
    const result = await UserModel.deleteMany({
      _id: { $in: userIds }, // Match users whose _id is in the array of IDs
    });
    if (result.deletedCount === 0) {
      throw new ApiError(400,'No users found to delete');
    }
    return result; // Contains information about the deleted documents
  } catch (error) {
    throw error; // Handle the error appropriately in your controller
  }
}

const isUserExists = async (userId) => await UserModel.exists({
    _id: userId,
  });

  const createNewUser = async(user)=>{
    const oldUser =await UserModel.findOne({ email:user.email.toLowerCase() });
    if(oldUser)
      throw new APIError(httpStatus.BAD_REQUEST,"Email already exists.")
    const newUser = await UserModel.create(user);
    if(!newUser)
      throw new APIError(httpStatus.BAD_REQUEST,"Oops...seems our server needed a break!")
    return newUser;
  }
 
  const fetchUserFromEmail= async ({ email }) => {
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
    })
    .lean();
  
    if (!user)
      throw new APIError(httpStatus.BAD_REQUEST, 'please sign up - this email does not exist');
  
    return user;
  };
export {
    getUserFromId,
    isUserExists,
    createNewUser,
    fetchUserFromEmail,
    getPaginatedUsers,
    bulkUpdateUserStatus,
    bulkDeleteUsersByIds
}