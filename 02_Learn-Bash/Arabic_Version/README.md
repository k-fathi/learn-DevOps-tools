
# Bash Scripting - الدليل الشامل لكتابة سكريبتات الباش

<div align="center">

![Bash](https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnu-bash&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![Markdown](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/k-fathi/learn-DevOps-tools/pulls)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/k-fathi/learn-DevOps-tools/graphs/commit-activity)

**دليلك الكامل عشان تحترف كتابة سكريبتات الباش (Shell Scripting) من الصفر للأتمتة الكاملة.**

</div>

---

## عن الكورس ده - About This Course

<div align="right">

الـ Repository دي فيها **25 ملف Markdown** بيغطوا كل حاجة من أول أساسيات الشل (Shell Fundamentals) لحد معالجة النصوص المتقدمة (Text Processing) وجدولة المهام (Task Automation). كل درس متصمم عشان تذاكره لوحدك وكمان يكون مرجع سريع ليك في الشغل.

</div>

> ##  تابع تقدمك من خلال [DevOps Galaxy](https://devops-galaxy.me) عشان تسجل كل حاجة اتعلمتها وتلاقي مصادر تساعدك في التعلم.

### هتتعلم إيه؟ - Learning Objectives
<div align="right">

بعد ما تخلص الكورس ده، هتبقى برنس في الحاجات دي:
1. تفهم العلاقة بين الـ **Kernel** والـ **Shell** والـ **Terminal**.
2. تكتب وتنفذ **Bash Scripts** وتظبط الـ **Environment** صح.
3. تشتغل بالـ **Variables** والعمليات الحسابية (**Arithmetic**) والـ **Command Substitution**.
4. تعمل **Conditional Logic** باستخدام `if` و `case` والـ **Test Operators**.
5. تتحكم في **Loops** (`for`, `while`, `until`) والـ **Flow Control**.
6. تستخدم **Arrays** و **Functions** وتتعامل مع الملفات (**File I/O**).
7. تعالج النصوص بالـ **Regular Expressions** و `sed` و `awk` باحترافية.
8. تعمل **أتمتة مهام** (Automation) بالـ `cron` والـ `at`.

</div>

## محتويات الكورس - Course Modules

الكورس متقسم لـ **7 وحدات (Modules)** بياخدوك من الصفر للاحتراف:

### Module 1: أساسيات الباش - Bash Fundamentals
الأساس: إزاي الشل بيشتغل وإزاي تبدأ تكتب سكريبتات.
- [00_Kernel_Shell_and_Terminal.md](./00_Kernel_Shell_and_Terminal.md)
- [01_Scripts_Commands_and_Envaironment_Setup.md](./01_Scripts_Commands_and_Envaironment_Setup.md)

### Module 2: المتغيرات والبيانات - Variables & Data
التعامل مع البيانات والحسابات وناتج الأوامر.
- [02_Variables.md](./02_Variables.md)
- [04_Arithmetic_Operations_in_Bash.md](./04_Arithmetic_Operations_in_Bash.md)
- [05_Command_Substitution.md](./05_Command_Substitution.md)
- [03_Exit_status.md](./03_Exit_status.md)

### Module 3: مدخلات المستخدم والشروط - User Input & Conditions
قراءة المدخلات واختبار الشروط والتفريع.
- [06_Read_User_input.md](./06_Read_User_input.md)
- [07_Conditional_Operators.md](./07_Conditional_Operators.md)
- [08_If_statement.md](./08_If_statement.md)
- [10_Case_statement.md](./10_Case_statement.md)

### Module 4: اللوبات والتحكم في السير - Loops & Flow Control
التكرار والتحكم في سير البرنامج والقوائم.
- [12_For_loops.md](./12_For_loops.md)
- [15_While_loop.md](./15_While_loop.md)
- [18_untill.md](./18_untill.md)
- [13_Continue_Break.md](./13_Continue_Break.md)
- [14_Select_Command.md](./14_Select_Command.md)
- [16_shift_command.md](./16_shift_command.md)

### Module 5: التعبيرات المنتظمة - Pattern Matching & Regex
إتقان الـ Regular Expressions عشان تطابق وتتحقق من النصوص.
- [09_Regular_Expressions.md](./09_Regular_Expressions.md)

### Module 6: المصفوفات والدوال والملفات - Arrays, Functions & Files
بيانات منظمة وكود قابل لإعادة الاستخدام وعمليات الملفات.
- [11_Arrays.md](./11_Arrays.md)
- [19_Functions.md](./19_Functions.md)
- [17_read_files.md](./17_read_files.md)
- [20_source_command.md](./20_source_command.md)

### Module 7: معالجة النصوص والأتمتة - Text Processing & Automation
أدوات النصوص المتقدمة وجدولة المهام.
- [21_SED.md](./21_SED.md)
- [22_AWK.md](./22_AWK.md)
- [23_Schaduling.md](./23_Schaduling.md)
- [24_Capstone_Projects.md](./24_Capstone_Projects.md)

---

## ابدأ بسرعة - Quick Start
<div align="right">

### محتاج إيه عشان تبدأ؟ - Prerequisites
- جهاز عليه لينكس (سواء أساسي، أو Virtual Machine، أو حتى WSL2 على ويندوز).
- برنامج Terminal.
- معرفة أساسية بأوامر لينكس (شوف [Linux Admin 1](../../01_Learn-Linux/Admin_1_ar_version/README.md)).

### تذاكر إزاي؟ - Learning Path
1. **لو لسه بتبدأ:** خد الملفات بالترتيب من Module 1.
2. **لو مستواك متوسط:** خش علطول على Modules 3-4 عشان الشروط واللوبات.
3. **لو محترف:** ركز على Modules 5-7 للـ Regex ومعالجة النصوص والأتمتة.

### نصائح للمذاكرة - Study Tips
- اكتب كل أمر بإيدك (بلاش Copy-Paste عشان المعلومة تثبت).
- جرب على سيرفر تجريبي (Test VM) عشان لو بوظت حاجة متبقاش مشكلة.
- اكتب سكريبتات صغيرة تطبق بيها كل مفهوم جديد.
- راجع ملف [CHEATSHEET.md](./CHEATSHEET.md) كل فترة.

</div>

## مصادر إضافية - Additional Resources

### توثيق رسمي - Official Docs
- [GNU Bash Manual](https://www.gnu.org/software/bash/manual/)
- [Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html)
- [Advanced Bash-Scripting Guide](https://tldp.org/LDP/abs/html/)

### أماكن للتدريب - Practice
- [Exercism - Bash Track](https://exercism.org/tracks/bash) - تمارين باش تطبيقية.
- [HackerRank - Shell](https://www.hackerrank.com/domains/shell) - تحديات شل سكريبتنج.
- [ShellCheck](https://www.shellcheck.net/) - أداة أونلاين تراجعلك السكريبت وتلاقي الأخطاء.

### مجتمعات للنقاش - Communities
- [r/bash](https://reddit.com/r/bash)
- [Unix & Linux Stack Exchange](https://unix.stackexchange.com/)
- [Bash Hackers Wiki](https://wiki.bash-hackers.org/)

---

## ساهم معانا - Contributing

<div align="right">

مشاركتك تهمنا! لقيت غلطة إملائية؟ عندك شرح أحسن لحتة معينة؟ ابعتلنا PR فوراً!

### إزاي تساهم؟ - How to Contribute
1. اعمل Fork للـ Repo ده.
2. اعمل Branch جديد (`git checkout -b improvement/description`).
3. ضيف تعديلاتك العظيمة.
4. جرب السكريبتات الأول وتأكد إنها شغالة تمام.
5. ابعت Pull Request.

## ادعمنا - Support Us
لو الكورس ده فادك، ياريت تدعمنا بـ:
- اعمل **Star** للـ Repository دي.
- شير الكورس مع صحابك المهتمين.
- ساهم معانا في تحسين المحتوى.

</div>


## Author
**Kareem Fathy**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kareemfathy/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/k-fathi)

<div align="center">

**Made with ❤️ by Kareem Fathy**

</div>
