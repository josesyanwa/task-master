"""empty message

Revision ID: c290473c9218
Revises: b0a86f96e6f8
Create Date: 2024-03-12 22:06:29.153755

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c290473c9218'
down_revision = 'b0a86f96e6f8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('task_collaborators',
    sa.Column('task_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], name=op.f('fk_task_collaborators_task_id_tasks')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_task_collaborators_user_id_users')),
    sa.PrimaryKeyConstraint('task_id', 'user_id')
    )
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('collaborator_email', sa.String(length=100), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tasks', schema=None) as batch_op:
        batch_op.drop_column('collaborator_email')

    op.drop_table('task_collaborators')
    # ### end Alembic commands ###