# 09: الوصول لصلاحيات المدير (Superuser Access)

## 1. مقدمة
الـ **Superuser** (اللي هو الـ root) ده "كبير المنطقة". يقدر يعمل أي حاجة في السيستم. عشان كدة، لينكس بيمنع اليوزرز العاديين إنهم يعملوا حاجات خطيرة إلا لو معاهم إذن.

## 2. ملف الـ Sudoers
الأذونات دي بتتحدد في ملف اسمه `/etc/sudoers`.

### تعديل الملف
> [!WARNING]
> **إياك** تعدل الملف ده بـ `vim` أو `nano` مباشرة. لو غلطت في حرف، السيستم كله ممكن يقفل ومحدش يعرف يبقى Root تاني.

**دايماً استخدم:**
```bash
sudo visudo
```
الأداة دي بتراجع اللي كتبته وتتأكد إنه صح قبل ما تحفظ.

### شكل الأوامر (Syntax)
```bash
User    Machine=(TargetUser:TargetGroup)    Commands
root    ALL=(ALL:ALL)                       ALL
```

**شرح الخانات:**
1.  **User:** مين اللي هياخد الصلاحية؟ (اسم اليوزر).
2.  **Machine:** اسم الجهاز (غالباً `ALL`).
3.  **TargetUser:** الأمر هيشتغل بصلاحية مين؟ (غالباً `ALL` أو `root`).
4.  **Commands:** إيه الأوامر المسموحة؟ (اكتب المسار الكامل للأمر).

#### مثال: Sudo من غير باسورد
```bash
# اسمح لـ karim يشغل apt من غير ما يطلب باسورد
karim ALL=(ALL) NOPASSWD: /usr/bin/apt
```

## 3. إضافة يوزر لجروب الـ Sudo
بدل وجع الدماغ مع ملف sudoers، الأسهل والأأمن إنك تضيف اليوزر للجروب المسئول عن الإدارة (`sudo` في ديبيان، و `wheel` في ريد هات).

```bash
# Debian/Ubuntu
sudo usermod -aG sudo username

# RedHat/CentOS
sudo usermod -aG wheel username
```
*لازم اليوزر يعمل Logout و Login تاني عشان التغيير يطبق.*

## 4. التبديل بين اليوزرز (`su`)
| الأمر | الوصف |
| :--- | :--- |
| `su <user>` | بدل لليوزر ده (بس خليك بنفس إعداداتك الحالية). |
| `su - <user>` | بدل لليوزر ده (وحمل إعداداته). **هو ده الصح**. |
| `sudo -i` | افتح Root Shell (أفضل طريقة عشان تفضل Root فترة). |

## 5. سيناريوهات حقيقية

### سيناريو 1: صلاحيات محدودة
**المشكلة:** عايز ديفيلوبر يقدر يرستر الـ Nginx بس مش عايز تديله Root كامل.

**الحل:**
```bash
# استخدم visudo واكتب:
developer ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx, /usr/bin/systemctl status nginx
```

### سيناريو 2: حل مشكلة "user is not in the sudoers file"
**المشكلة:** اليوزر بيحاول يعمل sudo والسيستم بيطرده.

**الحل:**
```bash
# ادخل بـ Root وضيفه للجروب
usermod -aG sudo username  # Debian/Ubuntu
usermod -aG wheel username # RedHat/CentOS
```

### سيناريو 3: التشغيل التلقائي (Automation)
**المشكلة:** عندك سكربت محتاج يعمل update ومش عايز كل شوية يطلب باسورد.

**الحل:**
```bash
# استخدم visudo:
automation_user ALL=(ALL) NOPASSWD: /usr/bin/apt update, /usr/bin/apt upgrade
```

> [!WARNING]
> إوعى تدي `NOPASSWD: ALL` لأي حد إلا لو واثق 100%، عشان دي ثغرة أمنية كبيرة.

## 6. نصائح أمنية (Best Practices)
- متديش باسورد الـ Root لحد.
- استخدم `sudo` للحاجات المهمة بس.
- راقب اللوجات `/var/log/auth.log` عشان تشوف مين بيعمل إيه.

---

## 7. 🏆 مثال من سوق العمل: صلاحيات بالمللي (Granular Access)
**السيناريو:** عندك موظف جديد `junior_admin` محتاج يرستر سيرفر الويب `httpd` بس ممنوع يلمس أي ملفات إعدادات أو يوقف السرفر.

```bash
# 1. افتح الملف بـ visudo
sudo visudo

# 2. ضيف السطر ده:
# User     Host=(RunAs)    Command
junior_admin ALL=(root) /bin/systemctl restart httpd

# 3. النتيجة
# لو جرب يكتب: systemctl restart httpd -> هيشتغل تمام
# لو جرب يكتب: systemctl stop httpd    -> هيترفض (Denied)
# لو جرب يكتب: vi /etc/httpd.conf     -> هيترفض (Denied)
```

> **مبدأ أقل الصلاحيات (Least Privilege):** ادي الناس الصلاحيات اللي محتاجينها عشان يخلصوا شغلهم، ولا فتفوتة زيادة.
