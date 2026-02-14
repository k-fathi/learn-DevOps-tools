# 11: ملفات الشيل والسكربتات (Shell Files)

## 1. مقدمة
أول ما بتفتح الترمنال أو تعمل Login، في ملفات "سحرية" بتشتغل لوحدها في الخلفية عشان تجهزلك البيئة (تظبط الألوان، المتغيرات، والـ Aliases).

## 2. ملفات الإعدادات (Configuration Files)

### أ. إعدادات النظام كله (Admin)
دي بتطبق على **كل اليوزرز** اللي على الجهاز.
- `/etc/profile`: متغيرات البيئة وبرامج البدء.
- `/etc/bashrc`: الدوال (Functions) والـ Aliases العامة.
- `/etc/profile.d/`: مكان بنحط فيه سكربتات إضافية (مفيد جداً للتنظيم).

### ب. إعدادات المستخدم (User Specific)
دي بتطبق **عليك أنت بس**.
- `~/.bash_profile` أو `~/.profile`: بتشتغل لما تعمل Login.
- `~/.bashrc`: بتشتغل لما تفتح ترمنال جديد (Non-login shell). دي أهم واحدة ليك.
- `~/.bash_logout`: بتشتغل لما تعمل Logout (تنضيف).

## 3. الفرق بين الـ Login والـ Non-Login Shell

### Login Shell
بيشتغل لما تكتب اليوزر والباسورد (مثلاً داخل SSH أو TTY).
- **الترتيب:** `/etc/profile` ← `~/.bash_profile` ← `~/.bashrc` ← `/etc/bashrc`.

### Non-Login Shell
بيشتغل لما تكون فاتح الجرافيك وتفتح برنامج الترمنال، أو تشغل سكربت.
- **الترتيب:** `~/.bashrc` ← `/etc/bashrc`.

### رسم توضيحي
```
┌─────────────────────────────────────────────────────────────┐
│                    User Action                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
   LOGIN SHELL               NON-LOGIN SHELL
   (SSH/Console)             (bash command)
        │                             │
        ├─► /etc/profile             ├─► /etc/bash.bashrc
        │                             │
        ├─► ~/.bash_profile           └─► ~/.bashrc
        │   (sources ~/.bashrc)
        │
        │
        └─► ~/.bashrc
            ├─► Functions
            ├─► Aliases
            └─► Environment variables
```

## 4. تغيير الشيل بتاعك
ممكن تغير الشيل الافتراضي بتاعك باستخدام `chsh`.

```bash
# غير لـ Bash
chsh -s /bin/bash

# غير لـ Zsh
chsh -s /bin/zsh
```
*ملحوظة: لازم تعمل Logout وتدخل تاني عشان التغيير يشتغل.*

## 5. 🏆 مثال من سوق العمل: سكربت صيانة تفاعلي
**السيناريو:** عايز تعمل أداة بسيطة للموظفين الجدد تخليهم يقدروا يختاروا مهام الصيانة (تحديث، تنظيف، خروج) من غير ما يكتبوا أوامر معقدة.

```bash
#!/bin/bash

# اعرض القائمة
echo "Select an option:"
echo "1) Update System"
echo "2) Clean Temp Files"
echo "3) Exit"

# اقرأ اختيار اليوزر
read -p "Enter choice [1-3]: " choice

# نفذ حسب الاختيار
case $choice in
    1)
        echo "Updating system..."
        sudo apt update && sudo apt upgrade -y
        ;;
    2)
        echo "Cleaning temp files..."
        rm -rf /tmp/*
        echo "Done."
        ;;
    3)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid option."
        ;;
esac
```

> **النتيجة:** عملت أداة CLI صغيرة بتسهل الشغل اليومي وتمنع الأخطاء.

## 6. الزتونة (Key Takeaways)
- **`~/.bashrc`**: ده بيتك ومطرحك. حط فيه الـ Aliases وتظبيطاتك الخاصة.
- **`/etc/profile`**: سيبه للسيستم أدمن، ده بيأثر على الناس كلها.
- الـ **Login Shells** بتقرأ كل حاجة، الـ **Non-Login** بتركز على `.bashrc`.
