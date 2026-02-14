# Linux Admin 1 - زتونة الأوامر (Cheat Sheet)

مرجع سريع لأهم أوامر اللينكس اللي اتشرحت في الكورس ده. خلي الملف ده جنبك دايماً وأنت شغال.

---

## 📋 الفهرس
- [التحرك والملفات (Navigation & Files)](#-التحرك-والملفات)
- [معالجة النصوص (Text Processing)](#-معالجة-النصوص)
- [اليوزرز والصلاحيات (Users & Permissions)](#-اليوزرز-والصلاحيات)
- [إدارة العمليات (Processes)](#-إدارة-العمليات)
- [الشبكات (Networking)](#-الشبكات)
- [إدارة الحزم (Package Management)](#-إدارة-الحزم)
- [إدارة النظام واللوجات (System Administration)](#-إدارة-النظام-واللوجات)
- [اختصارات الكيبورد (Shortcuts)](#-اختصارات-الكيبورد)
- [🏆 أوامر المحترفين (Master One-Liners)](#-أوامر-المحترفين-master-one-liners)

---

## 🗂️ التحرك والملفات

| الأمر | الوصف | مثال |
|---------|-------------|---------|
| `pwd` | بيعرفك أنت واقف فين دلوقت (Print working directory) | `pwd` |
| `cd <dir>` | ادخل جوه فولدر معين | `cd /var/log` |
| `cd -` | ارجع لآخر مكان كنت فيه | `cd -` |
| `ls -la` | اعرض كل الملفات بالتفصيل (بما فيها المخفي) | `ls -lthr` |
| `tree -L 2` | شجرة الملفات (لحد عمق مستويين) | `tree -L 2 /etc` |
| `mkdir -p` | اعمل فولدرات جوه بعض مرة واحدة | `mkdir -p dir1/dir2/dir3` |
| `cp -r` | انسخ فولدر باللي فيه | `cp -r /src /dest` |
| `mv` | انقل ملف أو غير اسمه | `mv old.txt new.txt` |
| `rm -rf` | احذف فولدر باللي فيه (خلي بالك خطر جداً!) | `rm -rf /tmp/test` |
| `find` | دور على ملفات بمواصفات معينة | `find /home -name "*.log"` |
| `locate` | بحث سريع جداً عن الملفات (بيستخدم داتابيز) | `locate passwd` |

---

## 📄 معالجة النصوص

| الأمر | الوصف | مثال |
|---------|-------------|---------|
| `cat file` | اعرض محتوى الملف كله | `cat /etc/passwd` |
| `less file` | تصفح الملف صفحة صفحة (للأحجام الكبيرة) | `less /var/log/syslog` |
| `head -n 10` | اعرض أول 10 سطور بس | `head -n 10 file.txt` |
| `tail -f` | راقب الملف لايف (ممتاز للـ Logs) | `tail -f /var/log/apache2/access.log` |
| `grep <pattern>` | دور على كلمة جوه ملف | `grep "error" logfile.txt` |
| `grep -ri` | دور جوه فولدر كامل وبدون حساسيه للحروف | `grep -ri "failed" /var/log` |
| `cut -d: -f1` | قص عمود معين من الملف | `cut -d: -f1 /etc/passwd` |
| `tr 'a-z' 'A-Z'` | بدل حروف (مثلاً خليه كله Capital) | `echo "hello" \| tr 'a-z' 'A-Z'` |
| `sort` | رتب السطور أبجدياً أو رقمياً | `sort file.txt` |
| `uniq` | شيل التكرار (لازم يكون مترتب الأول) | `sort file.txt \| uniq` |
| `wc -l` | عد عدد السطور | `wc -l file.txt` |
| `sed 's/old/new/'` | استبدل نص بنص تاني | `sed 's/http/https/' config.txt` |
| `awk '{print $1}'` | اطبع العمود الأول (أداة قوية جداً) | `awk '{print $1}' file.txt` |

---

## 👥 اليوزرز والصلاحيات

| الأمر | الوصف | مثال |
|---------|-------------|---------|
| `whoami` | أنا داخل بمين؟ | `whoami` |
| `id username` | تفاصيل اليوزر (ID والجروبات) | `id karim` |
| `sudo <cmd>` | نفذ أمر بصلاحيات الـ Root | `sudo apt update` |
| `sudo -i` | ادخل بـ Root Shell كامل | `sudo -i` |
| `su - user` | بدل ليوزر تاني | `su - karim` |
| `useradd -m` | اعمل يوزر جديد واعمله Home Directory | `sudo useradd -m john` |
| `usermod -aG group user` | ضيف اليوزر لجروب (مهم جداً الـ aG-) | `sudo usermod -aG docker karim` |
| `userdel -r` | امسح اليوزر وملفاته | `sudo userdel -r john` |
| `passwd user` | غير باسورد اليوزر | `sudo passwd karim` |
| `chage -l user` | شوف صلاحية الباسورد | `sudo chage -l karim` |
| `groupadd group` | اعمل جروب جديد | `sudo groupadd devs` |
| `chmod 755 file` | غير صلاحيات الملف (بالأرقام) | `chmod 755 script.sh` |
| `chmod u+x file` | ادي صلاحية التنفيذ لليوزر المالك | `chmod u+x script.sh` |
| `chown user:group file` | غير مالك الملف والجروب بتاعه | `sudo chown karim:karim file.txt` |
| `umask 022` | حدد الصلاحيات الافتراضية للملفات الجديدة | `umask 022` |

### خريطة الصلاحيات (Permission Quick Reference)
| الرقم | الرمز | المعنى |
|-------|--------|---------|
| 7 | rwx | قراءة، كتابة، تنفيذ (تحكم كامل) |
| 6 | rw- | قراءة وكتابة |
| 5 | r-x | قراءة وتنفيذ |
| 4 | r-- | قراءة بس |
| 0 | --- | مفيش أي صلاحية |

**مثال:** `chmod 755 script.sh` معناها `rwxr-xr-x` (المالك: كل حاجة، الجروب والناس التانية: قراءة وتنفيذ بس).

---

## ⚙️ إدارة العمليات (Processes)

| الأمر | الوصف | مثال |
|---------|-------------|---------|
| `ps aux` | اعرض كل البرامج اللي شغالة | `ps aux` |
| `ps -ef` | شكل تاني لنفس الأمر | `ps -ef` |
| `pstree` | شجرة العمليات (مين شغل مين) | `pstree -p` |
| `top` | مراقبة حية لاستهلاك البرامج | `top` |
| `htop` | زي top بس أشيك وأسهل | `htop` |
| `pgrep name` | هات الـ PID بتاع برنامج بالاسم | `pgrep -a ssh` |
| `kill PID` | اقفل برنامج (باحترام) | `kill 1234` |
| `kill -9 PID` | اقفل برنامج (بالعافية - Force Kill) | `kill -9 1234` |
| `pkill name` | اقفل برنامج عن طريق اسمه | `pkill firefox` |
| `killall name` | اقفل كل نسخ البرنامج ده | `killall chrome` |
| `command &` | شغل الأمر في الخلفية | `./script.sh &` |
| `jobs` | شوف الأوامر اللي شغالة في الخلفية | `jobs` |
| `fg %1` | هات الأمر للواجهة تاني | `fg %1` |
| `bg %1` | كمل تشغيل الأمر المتوقف في الخلفية | `bg %1` |
| `nice -n 10 cmd` | شغل أمر بأولوية قليلة | `nice -n 10 `./script.sh` |
| `renice -5 -p PID` | غير أولوية برنامج شغال | `sudo renice -5 -p 1234` |

### خدمات النظام (Systemd Services)
| الأمر | الوصف | مثال |
|---------|-------------|---------|
| `systemctl start service` | شغل الخدمة | `sudo systemctl start nginx` |
| `systemctl stop service` | وقف الخدمة | `sudo systemctl stop nginx` |
| `systemctl restart service` | رستر الخدمة | `sudo systemctl restart nginx` |
| `systemctl reload service` | حمل الإعدادات من غير ما تقفل الخدمة | `sudo systemctl reload nginx` |
| `systemctl enable service` | خلي الخدمة تشتغل لوحدها لما الجهاز يفتح | `sudo systemctl enable nginx` |
| `systemctl disable service` | امنع الخدمة تشتغل مع الفتح | `sudo systemctl disable nginx` |
| `systemctl status service` | شوف حالة الخدمة إيه | `systemctl status sshd` |
| `systemctl list-units` | اعرض كل الخدمات الشغالة | `systemctl list-units --type=service` |

---

## 🌐 الشبكات (Networking)

| الأمر | الوصف | مثال |
|---------|-------------|---------|
| `ip a` | اعرض الـ IPs وكروت الشبكة | `ip a` |
| `ip link show` | اعرض كروت الشبكة وحالتها | `ip link show` |
| `ip route` | اعرض جدول التوجيه (Routing Table) | `ip route` |
| `ss -tuln` | شوف البورتات المفتوحة (Ports) | `ss -tuln` |
| `ping host` | اختبر الاتصال بسيرفر تاني | `ping -c 4 google.com` |
| `traceroute host` | تتبع مسار الباكيت رايحة فين | `traceroute google.com` |
| `nmcli` | أداة التحكم في الشبكة (CLI) | `nmcli connection show` |
| `nmcli con up <name>` | شغل اتصال معين | `nmcli con up "WiFi"` |
| `ssh user@host` | ادخل على سيرفر تاني عن بعد | `ssh root@192.168.1.10` |
| `ssh-keygen` | ولد مفاتيح التشفير (SSH Keys) | `ssh-keygen -t rsa -b 4096` |
| `ssh-copy-id user@host` | انسخ المفتاح العام للسيرفر | `ssh-copy-id user@192.168.1.10` |
| `scp file user@host:/path` | انسخ ملف لسيرفر تاني (مشفر) | `scp file.txt user@server:/tmp/` |
| `rsync -av src/ dest/` | زامن الملفات بذكاء (بيبعت اللي اتغير بس) | `rsync -av /data/ backup/` |

---

## 📦 إدارة الحزم (Package Management)

### Debian/Ubuntu (apt)
| الأمر | الوصف | مثال |
|---------|-------------|---------|
| `apt update` | حدث قائمة البرامج | `sudo apt update` |
| `apt upgrade` | نزل التحديثات الجديدة للبرامج | `sudo apt upgrade` |
| `apt install pkg` | نزل برنامج جديد | `sudo apt install nginx` |
| `apt remove pkg` | امسح البرنامج | `sudo apt remove nginx` |
| `apt purge pkg` | امسح البرنامج + ملفات إعداداته | `sudo apt purge nginx` |
| `apt search keyword` | دور على برنامج | `apt search python` |
| `apt show pkg` | اعرض تفاصيل البرنامج | `apt show nginx` |
| `dpkg -l` | اعرض كل البرامج المتسطبة | `dpkg -l` |
| `dpkg -i pkg.deb` | صطب ملف .deb يدوي | `sudo dpkg -i package.deb` |

### RedHat/CentOS (dnf/yum)
| الأمر | الوصف | مثال |
|---------|-------------|---------|
| `dnf update` | حدث البرامج | `sudo dnf update` |
| `dnf install pkg` | نزل برنامج | `sudo dnf install httpd` |
| `dnf remove pkg` | امسح برنامج | `sudo dnf remove httpd` |
| `dnf search keyword` | دور على برنامج | `dnf search python` |
| `dnf info pkg` | اعرض تفاصيل برنامج | `dnf info httpd` |
| `rpm -qa` | اعرض كل البرامج المتسطبة | `rpm -qa` |
| `rpm -ivh pkg.rpm` | صطب ملف .rpm يدوي | `sudo rpm -ivh package.rpm` |

---

## 🛠️ إدارة النظام واللوجات

### السجلات (Logs)
| الأمر | الوصف | مثال |
|---------|-------------|---------|
| `journalctl` | اعرض لوجات النظام (Systemd Logs) | `journalctl` |
| `journalctl -f` | تابع اللوجات لايف | `journalctl -f` |
| `journalctl -u service` | لوجات خدمة معينة بس | `journalctl -u sshd` |
| `journalctl -xe` | أخطاء لسه حاصلة حالاً مع شرح | `journalctl -xe` |
| `journalctl --since "1h"` | لوجات آخر ساعة | `journalctl --since "1 hour ago"` |
| `tail -f /var/log/syslog` | تابع ملف الـ Syslog التقليدي | `tail -f /var/log/syslog` |

### الهارد ديسك (Disk & Filesystem)
| الأمر | الوصف | مثال |
|---------|-------------|---------|
| `df -h` | المساحة المستهلكة في الديسكات | `df -h` |
| `du -sh directory` | مساحة فولدر معين | `du -sh /var/log` |
| `lsblk` | اعرض توصيلات الهاردات والبارتيشنات | `lsblk` |
| `mount` | اعرض الحاجات المعمولة لها Mount | `mount` |
| `mount /dev/sdb1 /mnt` | ركب بارتشن في فولدر | `sudo mount /dev/sdb1 /mnt/usb` |
| `umount /mnt` | افصل البارتيشن | `sudo umount /mnt/usb` |
| `mount -a` | ركب كل حاجة موجودة في fstab | `sudo mount -a` |

### الضغط والأرشفة (Archiving)
| الأمر | الوصف | مثال |
|---------|-------------|---------|
| `tar -czf archive.tar.gz dir/` | اضغط فولدر بـ gzip | `tar -czf backup.tar.gz /data/` |
| `tar -xzf archive.tar.gz` | فك ضغط ملف gzip | `tar -xzf backup.tar.gz` |
| `tar -cJf archive.tar.xz dir/` | اضغط فولدر بـ xz (ضغط أقوى) | `tar -cJf backup.tar.xz /data/` |
| `tar -tf archive.tar.gz` | اعرض محتويات الملف المضغوط من غير فك | `tar -tf backup.tar.gz` |
| `gzip file` | اضغط ملف (بيستبدل الملف الأصلي) | `gzip largefile.log` |
| `gunzip file.gz` | فك ضغط ملف | `gunzip largefile.log.gz` |

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

## 🏆 أوامر المحترفين (Master One-Liners)

### 🚀 تحليل اللوجات (أكتر 404 Errors)
بيجيبلك أكتر ناس حاولوا يدخلوا على صفحات مش موجودة بيستخدموا إيه.
```bash
cat access.log | grep "404" | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 5
```

### 🧹 تنظيف السيستم (مسح الملفات المؤقتة القديمة)
بيمسح أي ملف temp بقاله أكتر من 30 يوم من غير ما يبوظ الدنيا.
```bash
find /tmp -name "*.tmp" -type f -mtime +30 -print0 | xargs -0 rm -v
```

### 🔍 كشف محاولات الاختراق (SSH Failures)
مين حاول يخمن الباسورد بتاعك في آخر ساعة؟
```bash
journalctl -u ssh --since "1 hour ago" | grep "Failed password" | awk '{print $(NF-3)}' | sort | uniq -c
```

### 🌐 ويب سيرفر لحظي (Python)
شير الفولدر اللي أنت فيه ده كـ موقع ويب في ثانية.
```bash
python3 -m http.server 8000
```

### 📂 باك اب سريع (أرشفة وضغط)
اعمل نسخة احتياطية للموقع بتاريخ النهاردة واستبعد ملفات الكاش.
```bash
tar -czvf "backup_$(date +%F).tar.gz" /var/www/html --exclude='cache'
```

---

**عشان تفهم كل أمر بيعمل إيه بالتفصيل، ارجع لملفات الكورس الأساسية.**

[📚 ارجع للصفحة الرئيسية](./README.md)
