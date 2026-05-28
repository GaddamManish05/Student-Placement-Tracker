import Company from "../Models/companyModel.js";

// ADD COMPANY
// ADD COMPANY
export const addCompany = async (
  req,
  res
) => {

  try {

    const {

      companyName,

      role,

      packageOffered,

      location,

      minCGPA,

      allowedBranches,

      lastDate,

      driveDate,

      description,

    } = req.body;

    // ==================================
    // VALIDATION
    // ==================================
    if (

      !companyName ||

      !role ||

      !packageOffered ||

      !location ||

      !minCGPA ||

      !allowedBranches ||

      !lastDate ||

      !driveDate
    ) {

      return res.status(400).json({

        success: false,

        message:
        "All required fields must be filled",
      });
    }

    // ==================================
    // DUPLICATE CHECK
    // ==================================
    const existingCompany =
    await Company.findOne({

      companyName,

      role,

      isDeleted: false,
    });

    if (existingCompany) {

      return res.status(400).json({

        success: false,

        message:
        "Company drive already exists",
      });
    }

    // ==================================
    // CREATE COMPANY
    // ==================================
    const company =
    await Company.create({

      companyName:
      companyName.trim(),

      role:
      role.trim(),

      packageOffered,

      location:
      location.trim(),

      minCGPA,

      allowedBranches,

      lastDate,

      driveDate,

      description:
      description || "",
    });

    // ==================================
    // RESPONSE
    // ==================================
    return res.status(201).json({

      success: true,

      message:
      "Company added successfully",

      company,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to add company",
    });
  }
};


// GET ALL COMPANIES
export const getCompanies = async (
    req,
    res
) => {

    try {

        const companies = await Company.find({
            isDeleted: false
        }).sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            companies
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// DELETE COMPANY
export const deleteCompany = async (
    req,
    res
) => {

    try {

        const company = await Company.findById(
            req.params.id
        );

        if (!company || company.isDeleted) {

            return res.status(404).json({
                message: "Company not found"
            });

        }


        // SOFT DELETE
        company.isDeleted = true;

        await company.save();


        res.status(200).json({
            success: true,
            message: "Company deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ======================================
// UPDATE COMPANY
// ======================================
export const updateCompany =
async (
  req,
  res
) => {

  try {

    const {

      companyName,

      role,

      packageOffered,

      location,

      minCGPA,

      allowedBranches,

      lastDate,

      driveDate,

      description,

      status,

    } = req.body;

    // ==================================
    // FIND COMPANY
    // ==================================
    const company =
    await Company.findById(
      req.params.id
    );

    if (!company) {

      return res.status(404).json({

        success: false,

        message:
        "Company not found",
      });
    }

    // ==================================
    // UPDATE (Safe Partial Assignment)
    // ==================================
    if (companyName !== undefined) {
      company.companyName = companyName;
    }

    if (role !== undefined) {
      company.role = role;
    }

    if (packageOffered !== undefined) {
      company.packageOffered = packageOffered;
    }

    if (location !== undefined) {
      company.location = location;
    }

    if (minCGPA !== undefined) {
      company.minCGPA = minCGPA;
    }

    if (allowedBranches !== undefined) {
      company.allowedBranches = allowedBranches;
    }

    if (lastDate !== undefined) {
      company.lastDate = lastDate;
    }

    if (driveDate !== undefined) {
      company.driveDate = driveDate;
    }

    if (description !== undefined) {
      company.description = description;
    }

    if (status !== undefined) {
      company.status = status;
    }

    await company.save();

    // ==================================
    // RESPONSE
    // ==================================
    return res.status(200).json({

      success: true,

      message:
      "Company updated successfully",

      company,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
      "Failed to update company",
    });
  }
};

// ======================================
// GET COMPANY BY ID
// ======================================
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company || company.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      company,
      companies: company, // duplicate key for store compatibility
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};