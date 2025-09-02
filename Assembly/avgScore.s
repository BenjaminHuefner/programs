.data 

orig: .space 100	# In terms of bytes (25 elements * 4 bytes each)
sorted: .space 100

str0:	.asciiz "Enter the number of assignments (between 1 and 25): "
str1: 	.asciiz "Enter score: "
str2:	.asciiz "Original scores: "
str3: 	.asciiz "Sorted scores (in descending order): "
str4: 	.asciiz "Enter the number of (lowest) scores to drop: "
str5: 	.asciiz "Average (rounded down) with dropped scores removed: "
str6:	.asciiz "All scores dropped!"
space:	.asciiz " "
nl:	.asciiz "\n"

.text 

# This is the main program.
# It first asks user to enter the number of assignments.
# It then asks user to input the scores, one at a time.
# It then calls selSort to perform selection sort.
# It then calls printArray twice to print out contents of the original and sorted scores.
# It then asks user to enter the number of (lowest) scores to drop.
# It then calls calcSum on the sorted array with the adjusted length (to account for dropped scores).
# It then prints out average score with the specified number of (lowest) scores dropped from the calculation.
main: 
	addi $sp, $sp -4
	sw $ra, 0($sp)
	la $a0, str0 
	li $v0, 4 
	syscall 
	li $v0, 5	# Read the number of scores from user
	syscall
	
	# Your code here to handle invalid number of scores (can't be less than 1 or greater than 25)
num_score_loop_start:
	slti $t0, $v0,1 #branch if 0 and
	slti $t1, $v0,26 # if 1
	sub $t0, $t0, $t1 #will be -1 only if 0, then 1
	addi $t0, $t0, 1
	beq $t0, $0, num_score_loop_end
	li $v0, 4 
	syscall  
	li $v0, 5	# Read the number of scores from user
	syscall
	
	j num_score_loop_start
num_score_loop_end:	
	#end of my code

	move $s0, $v0	# $s0 = numScores
	move $t0, $0
	la $s1, orig	# $s1 = orig
	la $s2, sorted	# $s2 = sorted
loop_in:
	li $v0, 4 
	la $a0, str1 
	syscall 
	sll $t1, $t0, 2
	add $t1, $t1, $s1
	li $v0, 5	# Read elements from user
	syscall
	sw $v0, 0($t1)
	addi $t0, $t0, 1
	bne $t0, $s0, loop_in
	
	move $a0, $s0
	jal selSort	# Call selSort to perform selection sort in original array
	
	li $v0, 4 
	la $a0, str2 
	syscall
	move $a0, $s1	# More efficient than la $a0, orig
	move $a1, $s0
	jal printArray	# Print original scores
	li $v0, 4 
	la $a0, str3 
	syscall 
	move $a0, $s2	# More efficient than la $a0, sorted
	jal printArray	# Print sorted scores
	
	li $v0, 4 
	la $a0, str4 
	syscall 
	li $v0, 5	# Read the number of (lowest) scores to drop
	syscall
	
	# Your code here to handle invalid number of (lowest) scores to drop (can't be less than 0, or 
	# greater than the number of scores). Also, handle the case when number of (lowest) scores to drop 
	# equals the number of scores. 
	
drop_score_loop_start:
	slt $t0, $v0, $0 #branch if 0
	slt $t1, $s0, $v0 #and if 0
	add $t0, $t0, $t1 #should be 0
	beq $t0, $0, drop_score_loop_end
	li $v0, 4 
	syscall  
	li $v0, 5	# Read the number of scores from user
	syscall
	
	j drop_score_loop_start
drop_score_loop_end:
	sub $s3, $s0, $v0 #modified array size for average calculation
	beq $v0,$s0, all_scores_dropped
	#end of my code
	
	move $a1, $v0
	sub $a1, $s0, $a1	# numScores - drop
	move $a0, $s2
	jal calcSum	# Call calcSum to RECURSIVELY compute the sum of scores that are not dropped
	
	# Your code here to compute average and print it (you may also end up having some code here to help 
	# handle the case when number of (lowest) scores to drop equals the number of scores
	div $v0, $s3
	mflo $t0 #holing my average
	
	li $v0, 4 
	la $a0, str5 
	syscall 
	
	add $a0, $0, $t0
	li $v0, 1 
	syscall
	
	j end
	
all_scores_dropped:
	la $a0, str6 
	li $v0, 4 
	syscall
	#end of my code
	
end:	lw $ra, 0($sp)
	addi $sp, $sp 4
	li $v0, 10 
	syscall
	
	
# printList takes in an array and its size as arguments. 
# It prints all the elements in one line with a newline at the end.
printArray:
	# Your implementation of printList here	
	addi $sp, $sp -4
	sw $ra, 0($sp)
	add $t0, $0, $a0
	add $t1, $0, $a1
	la $t2, space
print_loop:
	
	li $v0, 1
	lw $a0, 0($t0)
	syscall
	
	li $v0, 4
	add $a0, $0, $t2
	syscall
	
	addi $t0, $t0, 4
	addi $t1, $t1, -1
	bne $t1,$0,print_loop
	
	la $a0, nl
	syscall

	lw $ra, 0($sp)
	addi $sp, $sp 4
	jr $ra
	
	
# selSort takes in the number of scores as argument. 
# It performs SELECTION sort in descending order and populates the sorted array
selSort:
	# Your implementation of selSort here
	addi $sp, $sp -4
	sw $ra, 0($sp)
	add $t0, $0, $a0
	la $t1, orig
	la $t2, sorted
	add $t6, $0, $t2 #copied so that I can keep a copy of base address
copy_loop:
	
	lw $t4, 0($t1)
	sw $t4, 0($t2)
	
	addi $t1, $t1, 4
	addi $t2, $t2, 4
	addi $t0, $t0, -1
	bne $t0, $0, copy_loop
	
	add $t0, $0, $0 #i
	addi $t7, $a0, -1 #len-1 stopping condition
sort_outer_loop_start:
	beq $t0, $t7, sort_outer_loop_end
	
	sll $t2, $t0, 2 #t2 holds offset for i
	add  $t3, $t6, $t2 #t3 holds current max address and t6 holds base address
	
	addi $t1, $t0, 1 #j
sort_inner_loop_start:
	beq $t1, $a0, sort_inner_loop_end
	
	sll $t2, $t1, 2 #t2 holds offset for j
	add $t2, $t2, $t6 #holding address for j
	lw $t4, 0($t3)#value at max index
	lw $t5, 0($t2)# value at j
	slt $t4, $t4, $t5 # 1 if max index < j
	bne $t4, $0, sort_if_true
	
	j sort_if_end
sort_if_true:

	add $t3, $0, $t2

sort_if_end:
	
	addi $t1,$t1, 1
	j sort_inner_loop_start
sort_inner_loop_end:
	
	
	lw $t4, ($t3) #t4 is now temp, holding the max
	
	sll $t2, $t0, 2 #t2 holds offset for i
	add  $t5, $t6, $t2 #t5 holds i's address and t6 holds base address
	lw $t2, 0($t5)# t2 holds the value at index i
	
	sw $t2, 0($t3) 
	sw $t4, 0($t5)
	
	addi $t0, $t0, 1
	j sort_outer_loop_start
sort_outer_loop_end:
	lw $ra, 0($sp)
	addi $sp, $sp 4
	jr $ra
	
	
# calcSum takes in an array and its size as arguments.
# It RECURSIVELY computes and returns the sum of elements in the array.
# Note: you MUST NOT use iterative approach in this function.
calcSum:
	# Your implementation of calcSum here
	addi $sp, $sp -8
	sw $ra, 4($sp)
	
	li $v0, 0
	beq $a1, $0, calcSum_end
	
	addi $a1, $a1, -1
	sw $a1, 0($sp)
	jal calcSum 
	
	lw $a1, 0($sp)
	sll $a1, $a1, 2
	add $t0, $a0, $a1
	lw $t0, 0($t0)
	add $v0, $v0, $t0
	
	
calcSum_end:
	lw $ra, 4($sp)
	addi $sp, $sp 8
	jr $ra
	
