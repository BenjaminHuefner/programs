.data
n:	.asciiz "\n"
str1:	.asciiz "Please enter a number: "
str2:	.asciiz "Sum of even numbers is: "
str3:	.asciiz "Sum of odd numbers is: "
.text
	
Input:	li $v0,4
	la $a0,str1
	syscall
	li $v0,5
	syscall
	beq $v0,$zero,Finish
	#t0 is odd/even checker, t1 is even count, t2 is odd count
	sll $t0,$v0,31
	bne $t0,$zero,Odd
	add $t1,$t1,$v0
	j Input
Odd:	add $t2,$t2,$v0
	j Input
	
Finish: li $v0,4
	la $a0,n
	syscall
	la $a0,str2
	syscall
	li $v0,1
	add $a0,$t1,$0
	syscall
	li $v0,4
	la $a0,n
	syscall
	la $a0,str3
	syscall
	li $v0,1
	add $a0,$t2,$0
	syscall
	li $v0,4
	la $a0,n
	syscall
	li $v0,10
	syscall
	