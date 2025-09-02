.data
	n:	.word 25
	str1:	.asciiz "Less than\n"
	str2:	.asciiz	"Less than or equal to\n"
	str3:	.asciiz	"Greater than\n"
	str4:	.asciiz "Greater than or equal to\n"
.text
	li $v0,5
	syscall
	addi $t0,$v0,0
	lw $t1,n
	slt $t2,$t0,$t1
	slt $t3,$t1,$t0
	bne $t2,$zero,LT
	bne $t3,$zero,GT
	beq $t2,$zero,GTOE
	beq $t3,$zero,LTOE
	j Finish

LT:	la $a0,str1
	li $v0,4
	syscall
	j Finish

GT:	la $a0,str3
	li $v0,4
	syscall
	j Finish
	
GTOE:	la $a0,str4
	li $v0,4
	syscall
	j Finish
	
LTOE:	la $a0,str2
	li $v0,4
	syscall
	j Finish

Finish:
	li $v0,10
	syscall