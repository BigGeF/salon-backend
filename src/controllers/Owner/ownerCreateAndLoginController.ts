

// 使用 Firebase ID 令牌登录（包括社交登录和邮箱密码登录）
import { Request, Response } from 'express';
import admin from '../../config/firebase';
import Owner from '../../models/Owner';
import { IOwner } from '../../models/Owner';

// 使用 Firebase ID 令牌登录（包括社交登录和邮箱密码登录）
export const socialLogin = async (req: Request, res: Response) => {
  const { idToken, phone, firstName, lastName } = req.body; // 增加了 firstName 和 lastName

  try {
    // 验证 Firebase ID 令牌
    if (!idToken) {
      throw new Error('Missing ID token');
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    console.log('Decoded token:', decodedToken);

    // 检查业主是否已存在
    let owner = await Owner.findOne({ firebaseUid });
    if (!owner) {
      console.log('Owner not found, creating a new one.');

      let firstNameToUse = '';
      let lastNameToUse = '';

      if (decodedToken.name) {
        // 如果 decodedToken 中有 name，拆分为 firstName 和 lastName
        const [first, ...lastNameParts] = decodedToken.name.split(' ');

        firstNameToUse = first;
        lastNameToUse = lastNameParts.join(' ')||'';
      } else {
        // 如果 decodedToken 中没有 name，使用前端传递的 firstName 和 lastName
        firstNameToUse = firstName || '';
        lastNameToUse = lastName || '';
      }

      const ownerData: Partial<IOwner> = {
        firebaseUid,
        email: decodedToken.email || '',
        firstName: firstNameToUse,
        lastName: lastNameToUse,
        phone: phone || decodedToken.phone_number || '',
        role: 'owner',
      };
      console.log("ownerData: " + JSON.stringify(ownerData));
      
      owner = new Owner(ownerData);
      await owner.save();
      console.log('Saved a new owner to MongoDB.');

      // 设置 Firebase 自定义用户角色（可选）
      await admin.auth().setCustomUserClaims(firebaseUid, { role: 'owner' });

      return res.status(201).json({ owner });
    }

    // 如果用户已经存在，直接返回用户数据
    res.status(200).json({ owner });
  } catch (error: any) {
    console.error('Error verifying ID token:', error);
    res.status(401).json({ message: 'Invalid or expired token.', error: error.message });
  }
};

// 检查邮箱是否已存在
export const checkEmailExists = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    // 忽略邮箱大小写的正则表达式
    const emailRegex = new RegExp(`^${email}$`, 'i');
    const owner = await Owner.findOne({ email: emailRegex });

    // 返回邮箱是否存在
    if (owner) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
//Error: Network response was not ok, from salonAPI.ts file
// at getSalonsByOwnerId (SalonsAPI.ts:13:15)
// at async queryFn (useSalonQuery.ts:15:20)