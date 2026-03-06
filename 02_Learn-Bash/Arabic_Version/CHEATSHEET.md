# Bash Scripting - زتونة الأوامر (Cheat Sheet)

مرجع سريع لأهم حاجات الباش سكريبتنج اللي اتشرحت في الكورس ده. خلي الملف ده جنبك دايماً وأنت بتكتب سكريبتات.

---

## 📋 الفهرس
- [أساسيات السكريبت (Script Basics)](#-أساسيات-السكريبت)
- [المتغيرات والتوسعة (Variables & Expansion)](#-المتغيرات-والتوسعة)
- [العمليات الحسابية (Arithmetic)](#-العمليات-الحسابية)
- [قراءة المدخلات (User Input)](#-قراءة-المدخلات)
- [الشروط والاختبارات (Conditionals)](#-الشروط-والاختبارات)
- [اللوبات (Loops)](#-اللوبات)
- [المصفوفات (Arrays)](#-المصفوفات)
- [الدوال (Functions)](#-الدوال)
- [عمليات النصوص (String Operations)](#-عمليات-النصوص)
- [التعبيرات المنتظمة (Regex)](#-التعبيرات-المنتظمة)
- [SED](#-sed)
- [AWK](#-awk)
- [عمليات الملفات (File Ops)](#-عمليات-الملفات)
- [الجدولة (Scheduling)](#-الجدولة)
- [اختصارات الكيبورد (Shortcuts)](#-اختصارات-الكيبورد)
- [🏆 أوامر المحترفين (Master One-Liners)](#-أوامر-المحترفين-master-one-liners)

---

## 📜 أساسيات السكريبت

| الصيغة | الوصف | مثال |
|--------|-------|------|
| `#!/bin/bash` | أول سطر في السكريبت (Shebang) - بيقول للنظام يشغله بالباش | `#!/bin/bash` |
| `chmod +x script.sh` | ادي السكريبت صلاحية التنفيذ | `chmod +x myscript.sh` |
| `./script.sh` | شغل السكريبت | `./myscript.sh` |
| `bash script.sh` | شغل من غير ما تدي صلاحية | `bash myscript.sh` |
| `$0` | اسم السكريبت نفسه | `echo $0` |
| `$1, $2, ...` | الـ Arguments اللي بتتبعت للسكريبت | `echo $1` |
| `$#` | عدد الـ Arguments | `echo "عدد: $#"` |
| `$@` | كل الـ Arguments (كل واحد لوحده) | `for arg in "$@"; do echo $arg; done` |
| `$*` | كل الـ Arguments (كلهم سطر واحد) | `echo $*` |
| `$$` | الـ PID بتاع السكريبت الحالي | `echo $$` |
| `$?` | الـ Exit Status بتاع آخر أمر اتنفذ | `echo $?` |
| `exit <n>` | اخرج من السكريبت بكود معين | `exit 0` |

---

## 🔤 المتغيرات والتوسعة

| الصيغة | الوصف | مثال |
|--------|-------|------|
| `VAR=value` | عرّف متغير (من غير مسافات!) | `NAME="Karim"` |
| `$VAR` أو `${VAR}` | استخدم قيمة المتغير | `echo "أهلاً $NAME"` |
| `readonly VAR` | خلي المتغير ثابت (مينفعش يتغير) | `readonly PI=3.14` |
| `unset VAR` | امسح المتغير | `unset NAME` |
| `export VAR` | صدّر المتغير للعمليات الفرعية | `export PATH=$PATH:/opt/bin` |
| `local VAR=value` | متغير محلي جوه الدالة بس | `local count=0` |
| `${VAR:-default}` | لو المتغير فاضي، استخدم القيمة الافتراضية | `echo ${NAME:-"ضيف"}` |
| `${VAR:=default}` | لو المتغير فاضي، حطله القيمة الافتراضية | `echo ${NAME:="ضيف"}` |
| `${VAR:+alt}` | لو المتغير موجود، استخدم القيمة البديلة | `echo ${NAME:+"موجود"}` |
| `${VAR:?error}` | لو المتغير فاضي، اطلع Error | `echo ${NAME:?"مش موجود!"}` |
| `${#VAR}` | طول النص (String) | `echo ${#NAME}` |
| `$(command)` | نفذ أمر وخد الناتج (Command Substitution) | `FILES=$(ls)` |

---

## 🔢 العمليات الحسابية

| الصيغة | الوصف | مثال |
|--------|-------|------|
| `$(( expr ))` | عملية حسابية | `echo $(( 5 + 3 ))` |
| `let "expr"` | نفذ عملية حسابية | `let "x = 5 + 3"` |
| `expr a + b` | آلة حاسبة خارجية | `expr 5 + 3` |
| `$(( a + b ))` | جمع | `echo $(( 10 + 5 ))` |
| `$(( a - b ))` | طرح | `echo $(( 10 - 5 ))` |
| `$(( a * b ))` | ضرب | `echo $(( 10 * 5 ))` |
| `$(( a / b ))` | قسمة (عدد صحيح بس) | `echo $(( 10 / 3 ))` |
| `$(( a % b ))` | باقي القسمة (Modulus) | `echo $(( 10 % 3 ))` |
| `$(( a ** b ))` | أُس (Exponentiation) | `echo $(( 2 ** 8 ))` |
| `$(( a++ ))` | زود واحد (بعدين) | `echo $(( x++ ))` |
| `$(( ++a ))` | زود واحد (حالاً) | `echo $(( ++x ))` |
| `bc -l` | حسابات بكسور (Floating-point) | `echo "10/3" \| bc -l` |

---

## 📥 قراءة المدخلات

| الصيغة | الوصف | مثال |
|--------|-------|------|
| `read VAR` | اقرأ مدخل من اليوزر | `read name` |
| `read -p "prompt" VAR` | اقرأ مع رسالة | `read -p "اكتب اسمك: " name` |
| `read -s VAR` | اقرأ بشكل سري (للباسوردات) | `read -s -p "الباسورد: " pass` |
| `read -t 5 VAR` | استنى 5 ثواني بس | `read -t 5 answer` |
| `read -n 1 VAR` | اقرأ حرف واحد بس | `read -n 1 choice` |
| `read -a ARRAY` | اقرأ في مصفوفة | `read -a fruits` |
| `read -r VAR` | اقرأ من غير تفسير الباك سلاش | `read -r filepath` |

---

## 🔀 الشروط والاختبارات

| الصيغة | الوصف | مثال |
|--------|-------|------|
| `if [ condition ]; then` | جملة شرطية If | `if [ $x -gt 5 ]; then echo "كبير"; fi` |
| `[[ condition ]]` | اختبار موسع (الأفضل) | `if [[ $name == "admin" ]]; then ...` |
| `if-elif-else-fi` | تفريع كامل | شوف تحت |
| `case $VAR in` | جملة Case (زي الـ Switch) | شوف تحت |

### مقارنات الأرقام
| العامل | المعنى | مثال |
|--------|--------|------|
| `-eq` | يساوي | `[ $a -eq $b ]` |
| `-ne` | لا يساوي | `[ $a -ne $b ]` |
| `-gt` | أكبر من | `[ $a -gt $b ]` |
| `-ge` | أكبر من أو يساوي | `[ $a -ge $b ]` |
| `-lt` | أصغر من | `[ $a -lt $b ]` |
| `-le` | أصغر من أو يساوي | `[ $a -le $b ]` |

### مقارنات النصوص
| العامل | المعنى | مثال |
|--------|--------|------|
| `=` أو `==` | النص متساوي | `[ "$a" = "$b" ]` |
| `!=` | النص مختلف | `[ "$a" != "$b" ]` |
| `-z` | النص فاضي | `[ -z "$a" ]` |
| `-n` | النص مش فاضي | `[ -n "$a" ]` |

### اختبارات الملفات
| العامل | المعنى | مثال |
|--------|--------|------|
| `-f` | ملف عادي موجود | `[ -f /etc/passwd ]` |
| `-d` | فولدر موجود | `[ -d /tmp ]` |
| `-e` | الحاجة دي موجودة | `[ -e /path/to/file ]` |
| `-r` | الملف قابل للقراءة | `[ -r file.txt ]` |
| `-w` | الملف قابل للكتابة | `[ -w file.txt ]` |
| `-x` | الملف قابل للتنفيذ | `[ -x script.sh ]` |
| `-s` | الملف مش فاضي | `[ -s file.txt ]` |

### العمليات المنطقية
| العامل | المعنى | مثال |
|--------|--------|------|
| `&&` أو `-a` | و (AND) | `[ $a -gt 0 ] && [ $a -lt 10 ]` |
| `\|\|` أو `-o` | أو (OR) | `[ $a -eq 0 ] \|\| [ $a -eq 1 ]` |
| `!` | مش (NOT) | `[ ! -f file.txt ]` |

### جملة Case
```bash
case $choice in
  1) echo "الاختيار الأول" ;;
  2|3) echo "الاختيار التاني أو التالت" ;;
  *) echo "أي حاجة تانية" ;;
esac
```

---

## 🔄 اللوبات

### For Loop
```bash
for i in 1 2 3 4 5; do
  echo "الرقم: $i"
done
```

### C-style For Loop
```bash
for (( i=0; i<10; i++ )); do
  echo $i
done
```

### While Loop
```bash
count=1
while [ $count -le 5 ]; do
  echo "العدد: $count"
  ((count++))
done
```

### Until Loop
```bash
count=1
until [ $count -gt 5 ]; do
  echo "العدد: $count"
  ((count++))
done
```

### Select Menu (قائمة اختيارات)
```bash
select option in "شغّل" "وقّف" "اخرج"; do
  case $option in
    "اخرج") break ;;
    *) echo "اخترت: $option" ;;
  esac
done
```

### التحكم في السير (Flow Control)
| الأمر | الوصف | مثال |
|-------|-------|------|
| `break` | اخرج من اللوب | `break` |
| `break n` | اخرج من n مستويات لوبات | `break 2` |
| `continue` | كمل للدورة الجاية | `continue` |
| `continue n` | كمل في اللوب رقم n | `continue 2` |
| `shift` | ازحلق الـ Arguments لليسار | `shift` |
| `shift n` | ازحلق بعدد n | `shift 2` |

---

## 📦 المصفوفات

| الصيغة | الوصف | مثال |
|--------|-------|------|
| `arr=(a b c)` | عرّف مصفوفة | `fruits=("تفاح" "موز" "عنب")` |
| `${arr[0]}` | هات العنصر الأول | `echo ${fruits[0]}` |
| `${arr[@]}` | كل العناصر | `echo ${fruits[@]}` |
| `${#arr[@]}` | عدد العناصر | `echo ${#fruits[@]}` |
| `arr[n]=value` | غير عنصر معين | `fruits[3]="برتقان"` |
| `arr+=(value)` | ضيف عنصر جديد | `fruits+=("فراولة")` |
| `unset arr[n]` | امسح عنصر | `unset fruits[1]` |
| `${arr[@]:s:n}` | جزء من المصفوفة (بداية:عدد) | `echo ${fruits[@]:1:2}` |
| `${!arr[@]}` | كل الـ Indices | `echo ${!fruits[@]}` |

---

## 🧩 الدوال

```bash
# عرّف دالة
function greet() {
  local name=$1
  echo "أهلاً يا $name!"
  return 0
}

# استدعي الدالة
greet "كريم"

# خد الناتج في متغير
result=$(greet "كريم")
```

| المفهوم | الوصف | مثال |
|---------|-------|------|
| `$1, $2, ...` | الـ Arguments بتاعة الدالة | `func arg1 arg2` |
| `local VAR` | متغير محلي جوه الدالة بس | `local count=0` |
| `return n` | ارجع Exit Status (من 0 لـ 255) | `return 0` |
| `$(func)` | خد ناتج الدالة | `result=$(func)` |
| `source file.sh` | حمّل الدوال من ملف تاني | `source utils.sh` |
| `. file.sh` | نفس source | `. utils.sh` |

---

## ✂️ عمليات النصوص

| الصيغة | الوصف | مثال |
|--------|-------|------|
| `${#str}` | طول النص | `echo ${#name}` |
| `${str:pos:len}` | جزء من النص (Substring) | `echo ${name:0:5}` |
| `${str#pattern}` | شيل أقصر بداية مطابقة | `echo ${file#*.}` |
| `${str##pattern}` | شيل أطول بداية مطابقة | `echo ${path##*/}` |
| `${str%pattern}` | شيل أقصر نهاية مطابقة | `echo ${file%.*}` |
| `${str%%pattern}` | شيل أطول نهاية مطابقة | `echo ${path%%/*}` |
| `${str/old/new}` | بدّل أول مطابقة | `echo ${str/foo/bar}` |
| `${str//old/new}` | بدّل كل المطابقات | `echo ${str//foo/bar}` |
| `${str^^}` | حوّل لحروف كبيرة (Uppercase) | `echo ${name^^}` |
| `${str,,}` | حوّل لحروف صغيرة (Lowercase) | `echo ${name,,}` |

---

## 🔍 التعبيرات المنتظمة

| النمط | الوصف | مثال |
|-------|-------|------|
| `.` | أي حرف واحد | `grep "h.t" file` |
| `*` | صفر أو أكتر من اللي قبله | `grep "ab*c" file` |
| `+` | واحد أو أكتر من اللي قبله (ERE) | `grep -E "ab+c" file` |
| `?` | صفر أو واحد من اللي قبله (ERE) | `grep -E "ab?c" file` |
| `^` | بداية السطر | `grep "^Hello" file` |
| `$` | نهاية السطر | `grep "world$" file` |
| `[abc]` | أي حرف من المجموعة | `grep "[aeiou]" file` |
| `[^abc]` | أي حرف مش في المجموعة | `grep "[^0-9]" file` |
| `[a-z]` | نطاق | `grep "[a-zA-Z]" file` |
| `{n}` | مرات محددة (ERE) | `grep -E "[0-9]{3}" file` |
| `{n,m}` | بين n و m مرة (ERE) | `grep -E "[0-9]{2,4}" file` |
| `\b` | حدود الكلمة | `grep "\bword\b" file` |
| `(a\|b)` | أو (Alternation) (ERE) | `grep -E "(cat\|dog)" file` |
| `=~` | مطابقة Regex في الباش | `[[ $str =~ ^[0-9]+$ ]]` |

---

## 📝 SED

| الأمر | الوصف | مثال |
|-------|-------|------|
| `sed 's/old/new/' file` | بدّل أول واحدة في كل سطر | `sed 's/http/https/' urls.txt` |
| `sed 's/old/new/g' file` | بدّل كلهم في السطر | `sed 's/foo/bar/g' file.txt` |
| `sed -i 's/old/new/g' file` | عدّل على الملف مباشرة | `sed -i 's/old/new/g' config.txt` |
| `sed -i.bak 's/old/new/g'` | عدّل مع باك أب | `sed -i.bak 's/v1/v2/g' conf.txt` |
| `sed 'nd' file` | امسح السطر رقم n | `sed '5d' file.txt` |
| `sed '/pattern/d' file` | امسح السطور اللي فيها الباترن | `sed '/^#/d' config.txt` |
| `sed -n 'np' file` | اطبع السطر رقم n بس | `sed -n '10p' file.txt` |
| `sed -n '/pattern/p' file` | اطبع السطور المطابقة بس | `sed -n '/error/p' log.txt` |
| `sed 'n,ms/old/new/'` | بدّل في نطاق سطور | `sed '2,5s/foo/bar/' file.txt` |
| `sed 'ni\text' file` | ادخل نص قبل سطر n | `sed '1i\#!/bin/bash' script.sh` |
| `sed 'na\text' file` | ادخل نص بعد سطر n | `sed '1a\# تعليق' script.sh` |

---

## 📊 AWK

| الأمر | الوصف | مثال |
|-------|-------|------|
| `awk '{print $1}' file` | اطبع العمود الأول | `awk '{print $1}' log.txt` |
| `awk '{print $NF}' file` | اطبع العمود الأخير | `awk '{print $NF}' log.txt` |
| `awk -F: '{print $1}'` | حدد الفاصل (Delimiter) | `awk -F: '{print $1}' /etc/passwd` |
| `awk '/pattern/' file` | اطبع السطور المطابقة | `awk '/error/' log.txt` |
| `awk 'NR==5' file` | اطبع سطر معين | `awk 'NR==5' file.txt` |
| `awk 'NR>=2 && NR<=5'` | اطبع نطاق سطور | `awk 'NR>=2 && NR<=5' file.txt` |
| `awk '{sum+=$1} END{print sum}'` | اجمع عمود | `awk '{sum+=$1} END{print sum}' nums.txt` |
| `awk '{print NR, $0}'` | ضيف أرقام سطور | `awk '{print NR, $0}' file.txt` |
| `awk 'BEGIN{...} {...} END{...}'` | برنامج AWK كامل | شوف تحت |
| `awk -v var=val` | ابعت متغير لـ AWK | `awk -v n=5 '$1 > n' file.txt` |

### برنامج AWK كامل
```bash
awk 'BEGIN { FS=":"; print "قائمة اليوزرز" }
     { print $1, $3 }
     END { print "المجموع:", NR }' /etc/passwd
```

---

## 📂 عمليات الملفات

| الصيغة | الوصف | مثال |
|--------|-------|------|
| `while read line` | اقرأ ملف سطر سطر | شوف تحت |
| `< file` | حوّل المدخلات من ملف (Input Redirect) | `while read line; do ...; done < file` |
| `> file` | حوّل المخرجات لملف (امسح القديم) | `echo "أهلاً" > file.txt` |
| `>> file` | ضيف على الملف (من غير مسح) | `echo "أهلاً" >> file.txt` |
| `2> file` | حوّل الأخطاء لملف (stderr) | `cmd 2> errors.log` |
| `&> file` | حوّل كل حاجة (stdout + stderr) | `cmd &> all.log` |
| `source file.sh` | نفذ ملف في الشل الحالي | `source config.sh` |
| `. file.sh` | نفس source | `. config.sh` |

### اقرأ ملف سطر سطر
```bash
while IFS= read -r line; do
  echo "$line"
done < input.txt
```

---

## ⏰ الجدولة

### Cron Jobs - المهام المجدولة
| الحقل | القيم | الوصف |
|-------|-------|-------|
| الدقيقة | 0-59 | الدقيقة من الساعة |
| الساعة | 0-23 | الساعة من اليوم |
| اليوم | 1-31 | يوم الشهر |
| الشهر | 1-12 | الشهر |
| يوم الأسبوع | 0-7 | يوم الأسبوع (0 و 7 = الأحد) |

| الأمر | الوصف | مثال |
|-------|-------|------|
| `crontab -e` | عدّل مهامك المجدولة | `crontab -e` |
| `crontab -l` | اعرض المهام الحالية | `crontab -l` |
| `crontab -r` | امسح كل المهام | `crontab -r` |

### أمثلة على Cron
```bash
# كل 5 دقايق
*/5 * * * * /path/to/script.sh

# كل يوم الساعة 2:30 الصبح
30 2 * * * /path/to/backup.sh

# كل اتنين الساعة 9 الصبح
0 9 * * 1 /path/to/report.sh

# أول يوم في كل شهر على نص الليل
0 0 1 * * /path/to/monthly.sh
```

### أمر At - مهمة لمرة واحدة
| الأمر | الوصف | مثال |
|-------|-------|------|
| `at <time>` | جدول مهمة لمرة واحدة | `at 10:00 AM` |
| `atq` | اعرض المهام المستنية | `atq` |
| `atrm <job>` | امسح مهمة | `atrm 3` |

---

## ⌨️ اختصارات الكيبورد (Shortcuts)

| الاختصار | وظيفته |
|----------|--------|
| `Ctrl + C` | اقتل العملية الحالية (Stop) |
| `Ctrl + D` | اخرج من الترمنال (Logout) |
| `Ctrl + Z` | علق العملية الحالية (Suspend) |
| `Ctrl + L` | نضف الشاشة (Clear) |
| `Ctrl + R` | دور في تاريخ الأوامر اللي كتبتها |
| `Ctrl + A` | روح لأول السطر |
| `Ctrl + E` | روح لآخر السطر |
| `Ctrl + U` | امسح من مكان المؤشر لحد الأول |
| `Ctrl + K` | امسح من مكان المؤشر لحد الآخر |
| `Alt + .` | الصق آخر كلمة كتبتها في الأمر اللي فات |
| `Tab` | كمل الكتابة (Auto-complete) |
| `Tab Tab` | اعرض كل الاحتمالات المتاحة |

---

## 🔐 أنماط شائعة (Common Patterns)

### تمبلت سكريبت جاهز
```bash
#!/bin/bash
set -euo pipefail  # لو في Error وقّف - لو متغير مش معرف وقّف - لو Pipe فشل وقّف

# طريقة الاستخدام
usage() {
  echo "Usage: $0 [-h] [-v] <argument>"
  exit 1
}

# هات الـ Arguments
while getopts "hv" opt; do
  case $opt in
    h) usage ;;
    v) VERBOSE=true ;;
    *) usage ;;
  esac
done
shift $((OPTIND - 1))

# الكود الأساسي هنا
echo "السكريبت بدأ..."
```

### التعامل مع الأخطاء
```bash
command || { echo "الأمر فشل!"; exit 1; }
```

### تأكد إنك Root
```bash
if [[ $EUID -ne 0 ]]; then
  echo "السكريبت ده لازم يتشغل بـ Root"
  exit 1
fi
```

### دالة Log
```bash
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}
log "السكريبت بدأ"
```

---

## 🏆 أوامر المحترفين (Master One-Liners)

### 🚀 غير امتداد كل الملفات مرة واحدة
```bash
for f in *.txt; do mv "$f" "${f%.txt}.md"; done
```

### 🧹 دور وبدّل في ملفات كتير
بيدور على كل ملفات `.conf` ويبدل القيمة القديمة بالجديدة.
```bash
find . -name "*.conf" -exec sed -i 's/old_value/new_value/g' {} +
```

### 🔍 عد سطور الكود (من غير الفاضية)
```bash
find . -name "*.sh" -exec grep -cH "" {} + | awk -F: '{sum+=$2} END{print "المجموع:", sum}'
```

### 🌐 استخرج عمود من ملف CSV
```bash
awk -F',' '{print $2}' data.csv | sort | uniq -c | sort -rn | head
```

### 📂 معالجة ملفات بالتوازي
```bash
find /logs -name "*.log" -print0 | xargs -0 -P 4 -I {} grep -l "ERROR" {}
```

---

## 📌 نصائح ذهبية (Pro Tips)

1. **دايماً حط المتغيرات بين علامات تنصيص عشان متبوظش لو فيها مسافات:**
   ```bash
   echo "$filename"  # صح
   echo $filename    # ممكن يبوظ لو فيه مسافات
   ```

2. **حط `set -euo pipefail` في أول أي سكريبت للشغل:**
   ```bash
   set -euo pipefail
   ```

3. **استخدم `shellcheck` يراجعلك السكريبت قبل ما تشغله:**
   ```bash
   shellcheck myscript.sh
   ```

4. **استخدم `[[ ]]` بدل `[ ]` للاختبارات (أحسن وأقل مشاكل):**
   ```bash
   [[ -f "$file" && "$name" == "admin" ]]
   ```

5. **استخدم `printf` بدل `echo` عشان الكود يشتغل في كل مكان:**
   ```bash
   printf "الاسم: %s\nالعمر: %d\n" "$name" "$age"
   ```

---

**عشان تفهم كل حاجة بالتفصيل، ارجع لملفات الكورس الأساسية.**

[📚 ارجع للصفحة الرئيسية](./README.md)
