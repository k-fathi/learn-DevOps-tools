# Scheduling Tasks in Linux

Efficient task scheduling is essential for automation and system maintenance.  
Linux provides powerful tools to schedule both one-time and recurring tasks.

---

## 1. `at` Command: One-Time Scheduling

Use the `at` command to schedule a task or script to run **once** at a specified time.

### Syntax

- `at [time]`
   - Schedule a command to run at a specific time.
   - **Examples for `[time]`:**  
      `18:05`, `11am`, `now + 5 min`, `tomorrow`, `Monday`, `next week`, `12/10/2020`, `12.10.2025`
- `at [time] -f <script-name>`
   - Run a script at the specified time.
- `at [time] -m`
   - Send an email notification after the job completes.

### Example

```bash
at 11am -f myscript.sh
```
*This schedules `myscript.sh` to run at 11am.*

### Viewing Scheduled Jobs

- `atq` or `at -l`  
   *Lists all pending `at` jobs for the current user.*

> **Note:**  
> - The `atd` daemon must be running for `at` jobs to execute.
> - Jobs are executed only once at the scheduled time.

---

### Removing Scheduled Jobs

- `atrm [job_number]`
   - Remove a specific job by its job number.
   - Example: `atrm 5` removes job number 5.

## 2. `crontab` Command: Recurring Scheduling

Use `crontab` to schedule tasks or scripts to run **repeatedly** at specified intervals.

### Syntax

- `crontab -e`
   - Opens the crontab file for editing (per user).
   - Each line represents a scheduled job.
   - Used for normal user scripts.

## Crontab Format

The crontab file consists of lines with the following format:  
![Crontab Example](images/23-1_image.png)

- `* * * * * [command]`
   - **Fields:**  
      `Minute Hour Day_of_Month Month Day_of_Week`
   - **Example:**
      ```bash
      * * * * * /path/to/script.sh
      ```
      *Runs `/path/to/script.sh` every minute.*

- For more information and to easily generate cron expressions, visit [crontab.guru](https://crontab.guru).

### Notes

- Each user has their own crontab.
- Use `crontab -l` to list current cron jobs.
- Use `crontab -r` to remove all cron jobs for the user.
- Special strings like `@reboot`, `@daily`, `@hourly` can simplify scheduling.

#### Example

```bash
@daily /path/to/backup.sh
# Runs `backup.sh` every day at midnight.
```

> **Tip:**  
> Use absolute paths in your cron jobs to avoid environment issues.

---

## Scheduling Tasks with Root Privileges

### Using the `/etc/crontab` File

- The `/etc/crontab` file allows scheduling tasks with root privileges.
   - It can be customized to run commands as different users, with different times.
   - Simply by adding the time fields and the specific user before the script
   - Example entry:
     ```bash
     0 2 * * * Heisenberg /path/to/backup.sh
     # Runs `backup.sh` as the `Heisenberg` user every day at 2 AM.
     ```
     
- This file can schedule tasks for all users and has an additional field for the user to run the command as.
- There are also special directories:
   - `/etc/cron.daily`, `/etc/cron.hourly`, `/etc/cron.weekly`, `/etc/cron.monthly`
- Scripts placed in these directories run at specific intervals without needing to edit the crontab file directly.

---

**Summary Table**

| Tool              | Use Case           | Command Example                        | Notes                              |
|-------------------|--------------------|----------------------------------------|------------------------------------|
| `at`              | One-time task      | `at 11am -f myscript.sh`               | Needs `atd` daemon running         |
| `crontab`         | Recurring task     | `crontab -e` + cron syntax             | Per-user, persistent               |
| `/etc/crontab`    | System-wide tasks  | Edit `/etc/crontab` + cron syntax      | For root and all users             |
| `cron directories`| Scheduled scripts  | Place scripts in `/etc/cron.daily`, etc.| Runs at specific intervals         |
