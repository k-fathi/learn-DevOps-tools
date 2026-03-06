#!/bin/bash
courses=(Linux Bash Git Docker K8s Terraform)
select course in ${courses[@]}
do
	echo "Selected Course: $course"
done
