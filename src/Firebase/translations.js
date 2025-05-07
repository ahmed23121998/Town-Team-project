import { db } from "./firebase.js";
import { doc, setDoc } from "firebase/firestore";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase"; // تأكد من إعداد Firebase بشكل صحيح

const fetchLocalization = async (lang) => {
  const docRef = doc(db, "localization", "translations");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data()[lang]; // ستأخذ البيانات بناءً على اللغة المختارة
  } else {
    console.error("No localization data found!");
    return {};
  }
};

const translations = {
    en: {
      header: {
        men: "Men",
        kids: "Kids",
        new_arrivals: "New Arrivals",
        collections: "Collections",
        shoes: "Shoes",
        summer: "Summer",
        winter: "Winter",
        sale: "Sale",
      },
      hero: {
        welcome: "Welcome to Town Team",
        shop_now: "Shop Now",
        discover: "Discover the New Collection",
      },
      buttons: {
        add_to_cart: "Add to Cart",
        buy_now: "Buy Now",
        submit: "Submit",
        checkout: "Checkout",
        view_more: "View More",
      },
      cart: {
        your_cart: "Your Cart",
        empty_cart: "Your cart is empty",
        total: "Total",
        continue_shopping: "Continue Shopping",
        remove: "Remove",
      },
      account: {
        login: "Login",
        signup: "Sign Up",
        logout: "Logout",
        welcome: "Welcome Back!",
        email: "Email Address",
        password: "Password",
        forgot_password: "Forgot Password?",
      },
      footer: {
        newsletter_signup: "Sign up for Town Team newsletter",
        newsletter_description: "Be the first to know about our newest arrivals, special offers, and store events near you.",
        enter_email: "Enter your email address",
        follow_us: "Follow Us",
        contact_us: "Contact Us",
        rights_reserved: "All rights reserved.",
      }
    },
    ar: {
      header: {
        men: "رجال",
        kids: "أطفال",
        new_arrivals: "وصل حديثًا",
        collections: "المجموعات",
        shoes: "أحذية",
        summer: "صيف",
        winter: "شتاء",
        sale: "تخفيضات",
      },
      hero: {
        welcome: "مرحبًا بك في تاون تيم",
        shop_now: "تسوق الآن",
        discover: "اكتشف المجموعة الجديدة",
      },
      buttons: {
        add_to_cart: "أضف إلى السلة",
        buy_now: "اشتري الآن",
        submit: "إرسال",
        checkout: "الدفع",
        view_more: "عرض المزيد",
      },
      cart: {
        your_cart: "سلتك",
        empty_cart: "سلتك فارغة",
        total: "الإجمالي",
        continue_shopping: "مواصلة التسوق",
        remove: "إزالة",
      },
      account: {
        login: "تسجيل الدخول",
        signup: "إنشاء حساب",
        logout: "تسجيل الخروج",
        welcome: "مرحبًا بعودتك!",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        forgot_password: "هل نسيت كلمة المرور؟",
      },
      footer: {
        newsletter_signup: "اشترك في نشرة تاون تيم البريدية",
        newsletter_description: "كن أول من يعرف عن أحدث منتجاتنا، العروض الخاصة وفعاليات المتجر القريبة منك.",
        enter_email: "أدخل بريدك الإلكتروني",
        follow_us: "تابعنا",
        contact_us: "اتصل بنا",
        rights_reserved: "جميع الحقوق محفوظة.",
      }
    }
  };
  
  export default translations;
  