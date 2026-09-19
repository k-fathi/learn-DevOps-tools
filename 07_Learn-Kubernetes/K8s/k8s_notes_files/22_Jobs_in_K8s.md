# Jobs in Kubernetes

## Overview

Jobs are used for running tasks that are expected to terminate after completion. They ensure that a specified number of pods successfully complete their work before the job is considered done.

### Use Cases

- Running batch processing tasks
- Executing one-time scripts or data processing jobs
- Tasks that require guaranteed completion

## Job Behavior

- If a pod fails or is deleted before the job completes, the Job controller automatically creates a replacement pod
- Continues until the specified number of successful completions is reached
- Once a pod completes successfully, no new pods are created for that completion

### Example Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
    name: example-job
spec:
    template:
        spec:
            containers:
            - name: example-container
                image: busybox
                command: ["sh", "-c", "echo Hello, Kubernetes! && sleep 30"]
            restartPolicy: Never
```

## Key Configuration Options

| Feature | Purpose |
|---------|---------|
| **Parallelism** | Run multiple pods concurrently to divide work into chunks |
| **Completions** | Specify successful completions required for job completion |
| **Backoff Limit** | Set retry attempts before job fails |
| **Active Deadline Seconds** | Enforce time limit for job execution |

### Configuration Examples

```yaml
spec:
    parallelism: 3                 # Run 3 pods in parallel
    completions: 5                 # Require 5 successful completions
    backoffLimit: 4                # Retry up to 4 times
    activeDeadlineSeconds: 60      # Complete within 60 seconds
```

### Restart Policy

Set `restartPolicy: Never` to prevent pod restart on failure. The Job controller will create a new pod instead.



### Lets See some Scenarios of Jobs in Kubernetes
1. **Scenario 1: Basic Job**
   - Create a job that runs a simple command and completes successfully.
   ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
        name: basic-job
    spec:
        template:
            spec:
                containers:
                - name: basic-container
                    image: busybox
                    command: ["sh", "-c", "echo Hello, Kubernetes! && sleep 30"]
                restartPolicy: Never
   ```
   - The job will run a single pod that prints "Hello, Kubernetes!" and then sleeps for 30 seconds before completing.

2. **Scenario 2: failed Job**
   - Create a job that runs a command that will fail.
   ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
        name: failed-job
    spec:
        template:
            spec:
                containers:
                - name: failed-container
                    image: busybox
                    command: ["sh", "-c", "exit 1"] 
                restartPolicy: Never
   ```
   - The job will run a single pod that exits with a non-zero status, causing the job to fail.
   - The kubelet will let the pod to be `failed` as we defined `restartPolicy: Never`
   - The Job Controller will recreate the pod again untill it reaches the `backoffLimit` (default is 6) and then the job will be marked as `failed` and no more pods will be created.

3. **Scenario 3: Parallel Job**
   - Create a job that runs multiple pods in parallel.
   ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
        name: parallel-job
    spec:
        parallelism: 3
        template:
            spec:
                restartPolicy: Never
                containers:
                - name: parallel-container
                    image: busybox
                    command: ["echo", "Hello, Kubernetes!"]
   ```
   - The job will run 3 pods in parallel.
   -  The job will be considered complete when all 3 pods have completed successfully.

4. **Scenario 4: Job with Completions**
   - Create a job that requires multiple successful completions.
   ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
        name: completions-job
    spec:
        completions: 5
        template:
            spec:
                restartPolicy: Never
                containers:
                - name: completions-container
                    image: busybox
                    command: ["echo", "Hello, Kubernetes!"]
   ```
   - The job will run pods until it achieves 5 successful completions.
   - If a pod fails, the Job Controller will create a new pod to replace it until the required number of successful completions is reached.
   
5. **Scenario 5: Completion + Parallelism**
   - Create a job that requires multiple successful completions and runs multiple pods in parallel.
   ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
        name: parallel-completions-job
    spec:
        parallelism: 3
        completions: 5
        template:
            spec:
                restartPolicy: Never
                containers:
                - name: parallel-completions-container
                    image: busybox
                    command: ["echo", "Hello, Kubernetes!"]
   ```
   - The job will run up to 3 pods in parallel and will continue creating new pods until it achieves 5 successful completions.
   - The Job must only has 3 pods running at any given time, and it will create new pods as needed to reach the total of 5 successful completions.

6. **Scenario 6: Job with Active Deadline**
   - Create a job that has a time limit for completion.
   ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
        name: deadline-job
    spec:
        activeDeadlineSeconds: 60
        template:
            spec:
                restartPolicy: Never
                containers:
                - name: deadline-container
                    image: busybox
                    command: ["sh", "-c", "echo Hello, Kubernetes! && sleep 120"]
   ```
   - The job will run a pod that sleeps for 120 seconds, but the job has an active deadline of 60 seconds.
   - The job will be marked as failed after 60 seconds, and the pod will be terminated if it is still running.

7. **Scenario 7: Job with Backoff Limit**
   - Create a job that has a limit on the number of retries for failed pods.
   ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
        name: backoff-job
    spec:
        backoffLimit: 3
        template:
            spec:
                restartPolicy: Never
                containers:
                - name: backoff-container
                    image: busybox
                    command: ["sh", "-c", "exit 1"]
   ```
   - The job will run a pod that fails immediately, and the job has a backoff limit of 3.
   - The Job Controller will retry creating new pods up to 3 times before marking the job as failed.
   - Unlike the basic case which has a default backoff limit of 6, this job will fail after 3 retries.
   - After all the retries are exhausted, the job will be marked as failed and no more pods will be created, but will not be deleted, and you can check the status of the job and its pods using `kubectl get jobs` and `kubectl get pods`.



# Cron Jobs in K8s
## Overview

Cron jobs are more useful to use when you want to run a job at a specific time or on a recurring schedule, such as daily, weekly, or monthly. For example, you might use a cron job to run a backup script every night at midnight, or to send out a report every Monday morning.

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: example-cronjob
spec:
  schedule: "* * * * *" # This cron expression means the job will run every minute
  jobTemplate:
    spec:
        template:
            spec:
                containers:
                - name: example-container
                    image: busybox
                    command: ["sh", "-c", "echo Hello, Kubernetes! && sleep 30"]
                    imagePullPolicy: IfNotPresent 
                restartPolicy: Never
```

> ## See [Guru](https://crontab.guru/) for more information about cron jobs in K8s.


### Some Important Notes about Cron Jobs in K8s
- For the previous example, the cron job will run every minute.

- It is not preferred for K8s to run a cron job every minute, as it can create a lot of load on the cluster and may cause performance issues.

- So, we use some flags to control the behavior of the cron job, such as `concurrencyPolicy`, `successfulJobsHistoryLimit`, and `failedJobsHistoryLimit`.
```yaml
spec:
    schedule: "0 0 * * *" # This cron expression means the job will run every day at midnight
    successfulJobsHistoryLimit: 3 # This means that only the last 3 successful jobs will be kept, and the rest will be deleted
    failedJobsHistoryLimit: 1 # This means that only the last failed job will be kept, and the rest will be deleted
    concurrencyPolicy: Forbid # This means that if the previous job is still running, the new job will not be started
``` 


## Cron Job Command Examples
- to create a cron job from a YAML file
```bash
kubectl apply -f <cronjob-yaml-file>
```

- to get the list of cron jobs
```bash
kubectl get cronjobs
# or 
kubectl get cj
```

- to describe a cron job
```bash
kubectl describe cronjob <cronjob-name>
```

- to delete a cron job
```bash
kubectl delete cronjob <cronjob-name>
```
