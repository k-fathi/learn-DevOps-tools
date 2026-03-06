## 19. الـ Functions في باش (Functions)

الـ Function هي عبارة عن بلوك من الكود بتكتبه مرة واحدة وتديله اسم، وبدل ما تكرر الكود ده في أماكن كتير، بتنادي على مجرد اسمه وهو يتنفذ.

> **ملحوظة مهمة:** الأفضل دايماً إنك تعرّف الـ Functions بتاعتك في **أول** الإسكربت، عشان لما التيرمينال توصل لسطر النداء تكون قرأتها وعارفاها.

---

### صيغ كتابة الـ Functions (Syntax)
ممكن تكتب الـ Function بأكتر من شكل مقبوول في باش:

```bash
# الطريقة الأولى (الأكثر شيوعاً والمفضلة):
function func_name() {
    local var1="قيمة"  # ده Variable محلي (Local) بيتشاف جوه الـ Function بس
    # الكود بتاع الـ Function
}

# الطريقة التانية:
function fun_name() {
    # الكود
}

# الطريقة التالتة (سطر واحد):
function fun_name { # الكود ;}

# الطريقة الرابعة:
func_name (){
    # الكود 
}
```

---

### إزاي تنادي على الـ Function (Calling a Function)
عشان تشغلها، بتكتب اسمها بس. **ممنوع** بتستخدم الأقواس `()` وأنت بتناديها.
ولو عايز تبعتلها Inputs (Arguments)، بتكتبهم جنبها مسافة مسافة.
```bash
func_name arg1 arg2
```

---

### أمثلة Process

#### مثال 1: Function بسيطة للترحيب
```bash
greet() {
    local name=$1  # بياخد أول كلمة تتبعت للدالة
    echo "أهلاً بيك يا $name!"
}

# نداء الـ Function:
greet "كريم"
```

**النتيجة:**
```
أهلاً بيك يا كريم!
```

#### مثال 2: Function بتاخد أكتر من مدخل (حمع رقمين)
```bash
add_numbers() {
    local sum=$(( $1 + $2 ))
    echo "المجموع: $sum"
}

# نداء الـ Function:
add_numbers 5 7
```

**النتيجة:**
```
المجموع: 12
```

#### مثال 3: إرجاع قيمة من الـ Function (Returning Values)
في باش، الـ Functions مبترجعش قيمة بنظام `return` زي اللغات التانية (لإن `return` بيرجع بس Exit Status زي 0 أو 1). الحل؟ إننا نخلي الـ Function "تطبع" النتيجة، وإحنا بره نعمل "Command Substitution" دولار ساين وقوسين عشان نتلقف الطباعة دي في Variable.

```bash
get_length() {
    local str=$1
    echo ${#str}  # بيطبع طول الكلمة
}

# نداء الـ Function وتخزين الراجع:
length=$(get_length "BashScripting")
echo "عدد الحروف هو: $length"
```

**النتيجة:**
```
عدد الحروف هو: 13
```

> **نصيحة ذهبية:** اتعود دايماً تحط كلمة `local` قبل أي Variable جوه الـ Function، عشان لو في Variable بنفس الاسم بره الـ Function ميبوظوش بعض (عشان تفصل Scope الـ Variables).

![صيغة الـ Functions في باش](../images/ar/19_ar_img1.png)
![الفرق بين الطباعة والإرجاع في الباش](../images/ar/19_ar_img2.png)
