import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'tripatee_super_secret_jwt_key_12345', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Determine role (first user is admin, otherwise user)
    const usersCount = await User.countDocuments({});
    const role = usersCount === 0 ? 'admin' : 'user';
    const isVerified = usersCount === 0 ? true : false; // Auto-verify first admin

    const user = await User.create({
      name,
      email,
      password,
      role,
      isVerified,
      otp: isVerified ? null : otp,
      otpExpires: isVerified ? null : otpExpires,
    });

    if (user) {
      if (!isVerified) {
        // Send OTP email
        const emailMessage = `Welcome to Tripatee! Your verification code is ${otp}. This code expires in 10 minutes.`;
        try {
          await sendEmail({
            email: user.email,
            subject: 'Tripatee - Verify your Account',
            message: emailMessage,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                <h2 style="color: #0D6EFD;">Welcome to Tripatee!</h2>
                <p>Thank you for signing up. Please verify your account using the verification code below:</p>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #00C2A8; border-radius: 4px; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="font-size: 12px; color: #6c757d;">This OTP code is valid for 10 minutes. If you did not request this, you can ignore this email.</p>
              </div>
            `,
          });
        } catch (emailErr) {
          console.error('Failed to send verification email:', emailErr.message);
        }
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token: isVerified ? generateToken(user._id) : null,
        message: isVerified
          ? 'Account created and verified successfully!'
          : 'Registration successful! Verification code sent to email.',
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP for registration
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.isVerified) {
      return res.status(200).json({
        message: 'Account is already verified. You can log in.',
      });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      res.status(400);
      throw new Error('Invalid or expired verification code');
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token: generateToken(user._id),
      message: 'Account verified successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend registration OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOtp = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error('User is already verified');
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send email
    const emailMessage = `Your new verification code is ${otp}. This code expires in 10 minutes.`;
    await sendEmail({
      email: user.email,
      subject: 'Tripatee - Resend Verification Code',
      message: emailMessage,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #0D6EFD;">Verification Code</h2>
          <p>Please use the new verification code below to verify your Tripatee account:</p>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #00C2A8; border-radius: 4px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #6c757d;">This OTP code is valid for 10 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({
      message: 'Verification code resent successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log in user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      if (!user.isVerified) {
        // Send a new OTP
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendEmail({
          email: user.email,
          subject: 'Tripatee - Verify your Account',
          message: `Your verification code is ${otp}. Please verify before logging in.`,
          html: `<p>Your verification code is <b>${otp}</b>. Please verify before logging in.</p>`,
        });

        return res.status(403).json({
          message: 'Account not verified. A verification code has been sent to your email.',
          notVerified: true,
          email: user.email,
        });
      }

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - request recovery OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User with this email does not exist');
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Tripatee - Password Reset Verification',
      message: `Your password reset code is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #0D6EFD;">Reset Password request</h2>
          <p>We received a request to reset your password. Use the verification code below to perform the reset:</p>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #FFB703; border-radius: 4px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #6c757d;">This OTP code is valid for 10 minutes. If you did not request a password reset, please secure your account.</p>
        </div>
      `,
    });

    res.status(200).json({
      message: 'Password reset code sent to email!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using recovery OTP
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      res.status(400);
      throw new Error('Invalid or expired verification code');
    }

    // Set new password
    user.password = password;
    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true; // Mark verified if not already
    await user.save();

    res.status(200).json({
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
