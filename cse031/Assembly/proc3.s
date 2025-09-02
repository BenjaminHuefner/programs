.data
x:	.word 2
y:	.word 4
z:	.word 6
str:	.asciiz "p + q: "
n:	.asciiz "\n"
.text
MAIN:	la $t0, x
	lw $s0, 0($t0)		
	la $t0, y
	lw $s1, 0($t0)	
	la $t0, z
	lw $s2, 0($t0)	
		
	addiu $a0, $s0, 0
	addiu $a1, $s1, 0
	addiu $a2, $s2, 0
	jal FOO
	
	addu $t0, $s1, $s0
	addu $t0, $t0, $s2
	addu $t0, $t0, $v0
	
	addiu $a0, $t0, 0 
	li $v0, 1		 
	syscall	
	j END
		
FOO: 	addiu $sp, $sp -4
	sw $s0, 0($sp)
	addiu $sp, $sp -4
	sw $s1, 0($sp)
	addiu $sp, $sp -4
	sw $ra, 0($sp)	
	
	addiu $sp, $sp -4
	sw $a0, 0($sp)
	addiu $sp, $sp -4
	sw $a1, 0($sp)
	addiu $sp, $sp -4
	sw $a2, 0($sp)
	
	addu $t0, $a0, $a2
	addu $t1, $a1, $a2
	addu $t2, $a0, $a1
	
	addiu $a0, $t0, 0
	addiu $a1, $t1, 0
	addiu $a2, $t2, 0
	
	jal BAR
	addiu $s0, $v0, 0
	
	lw $a2, 0($sp)	
	addiu $sp, $sp 4
	lw $a1, 0($sp)	
	addiu $sp, $sp 4
	lw $a0, 0($sp)	
	addiu $sp, $sp 4
	
	subu $t0, $a0, $a2
	subu $t1, $a1, $a0
	addu $t2, $a1, $a1
	
	addiu $a0, $t0, 0
	addiu $a1, $t1, 0
	addiu $a2, $t2, 0
	
	jal BAR
	addiu $s1, $v0, 0
	
	addu $t0, $s0, $s1
	
	la $a0, str
	li $v0, 4		 
	syscall
	
	addiu $a0, $t0, 0 
	li $v0, 1		 
	syscall	
	
	la $a0, n
	li $v0, 4		 
	syscall
	
	addiu $v0, $t0, 0
	
	lw $ra, 0($sp)	
	addiu $sp, $sp 4
	lw $s1, 0($sp)		
	addiu $sp, $sp 4
	lw $s0, 0($sp)		
	addiu $sp, $sp 4
	jr $ra	
		
BAR:	subu $t0, $a1, $a0
LOOP:	beq $a2, $0, LEND
	sll $t0, $t0, 1
	addiu $a2, $a2, -1
	j LOOP

LEND:	addiu $v0, $t0, 0
	jr $ra

END:	li $v0, 10		 
	syscall
