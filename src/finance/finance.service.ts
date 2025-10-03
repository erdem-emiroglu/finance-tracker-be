import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  AnalysisSummaryDto,
  CategoryDto,
  CreateCategoryDto,
  CreateSavingsGoalDto,
  CreateSavingsToolDto,
  CreateTransactionDto,
  MonthlyReportDto,
  SavingsGoalDto,
  SavingsToolDto,
  TransactionDto,
  TransactionQueryDto,
  UpdateCategoryDto,
  UpdateSavingsGoalDto,
  UpdateSavingsToolDto,
  UpdateTransactionDto,
} from './dto/finance.dto';

@Injectable()
export class FinanceService {
  constructor(private supabaseService: SupabaseService) {}

  // ========== CATEGORY METHODS ==========

  async createCategory(
    userId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    const { data: category, error } = await this.supabaseService
      .getClient()
      .from('categories')
      .insert([
        {
          user_id: userId,
          name: createCategoryDto.name,
          type: createCategoryDto.type,
          color: createCategoryDto.color || '#3B82F6',
          icon: createCategoryDto.icon || 'category',
          is_default: false,
        },
      ])
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to create category: ${error.message}`,
      );
    }

    return category;
  }

  async getCategories(userId: string, type?: string): Promise<CategoryDto[]> {
    let query = this.supabaseService
      .getClient()
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (type) {
      query = query.eq('type', type);
    }

    const { data: categories, error } = await query;

    if (error) {
      throw new BadRequestException(
        `Failed to fetch categories: ${error.message}`,
      );
    }

    return categories || [];
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const { data: category, error } = await this.supabaseService
      .getClient()
      .from('categories')
      .update({
        ...updateCategoryDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', categoryId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      throw new NotFoundException(
        `Category not found or failed to update: ${error.message}`,
      );
    }

    return category;
  }

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('categories')
      .delete()
      .eq('id', categoryId)
      .eq('user_id', userId);

    if (error) {
      throw new NotFoundException(
        `Category not found or failed to delete: ${error.message}`,
      );
    }
  }

  // ========== TRANSACTION METHODS ==========

  async createTransaction(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    const { data: transaction, error } = await this.supabaseService
      .getClient()
      .from('transactions')
      .insert([
        {
          user_id: userId,
          category_id: createTransactionDto.category_id,
          amount: createTransactionDto.amount,
          type: createTransactionDto.type,
          description: createTransactionDto.description,
          date: createTransactionDto.date || new Date().toISOString(),
          tags: createTransactionDto.tags || [],
          location: createTransactionDto.location,
          payment_method: createTransactionDto.payment_method,
          notes: createTransactionDto.notes,
          is_recurring: createTransactionDto.is_recurring || false,
          recurring_frequency: createTransactionDto.recurring_frequency,
          recurring_end_date: createTransactionDto.recurring_end_date,
        },
      ])
      .select(
        `
        *,
        category:categories(*)
      `,
      )
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to create transaction: ${error.message}`,
      );
    }

    return transaction;
  }

  async getTransactions(
    userId: string,
    query: TransactionQueryDto,
  ): Promise<{ transactions: TransactionDto[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    let supabaseQuery = this.supabaseService
      .getClient()
      .from('transactions')
      .select(
        `
        *,
        category:categories(*)
      `,
        { count: 'exact' },
      )
      .eq('user_id', userId);

    // Apply filters
    if (query.start_date) {
      supabaseQuery = supabaseQuery.gte('date', query.start_date);
    }
    if (query.end_date) {
      supabaseQuery = supabaseQuery.lte('date', query.end_date);
    }
    if (query.type) {
      supabaseQuery = supabaseQuery.eq('type', query.type);
    }
    if (query.category_id) {
      supabaseQuery = supabaseQuery.eq('category_id', query.category_id);
    }
    if (query.min_amount) {
      supabaseQuery = supabaseQuery.gte('amount', query.min_amount);
    }
    if (query.max_amount) {
      supabaseQuery = supabaseQuery.lte('amount', query.max_amount);
    }

    const {
      data: transactions,
      error,
      count,
    } = await supabaseQuery
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new BadRequestException(
        `Failed to fetch transactions: ${error.message}`,
      );
    }

    return {
      transactions: transactions || [],
      total: count || 0,
    };
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    const { data: transaction, error } = await this.supabaseService
      .getClient()
      .from('transactions')
      .update({
        ...updateTransactionDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transactionId)
      .eq('user_id', userId)
      .select(
        `
        *,
        category:categories(*)
      `,
      )
      .single();

    if (error) {
      throw new NotFoundException(
        `Transaction not found or failed to update: ${error.message}`,
      );
    }

    return transaction;
  }

  async deleteTransaction(
    userId: string,
    transactionId: string,
  ): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('transactions')
      .delete()
      .eq('id', transactionId)
      .eq('user_id', userId);

    if (error) {
      throw new NotFoundException(
        `Transaction not found or failed to delete: ${error.message}`,
      );
    }
  }

  // ========== SAVINGS GOAL METHODS ==========

  async createSavingsGoal(
    userId: string,
    createGoalDto: CreateSavingsGoalDto,
  ): Promise<SavingsGoalDto> {
    const { data: goal, error } = await this.supabaseService
      .getClient()
      .from('savings_goals')
      .insert([
        {
          user_id: userId,
          name: createGoalDto.name,
          description: createGoalDto.description,
          target_amount: createGoalDto.target_amount,
          current_amount: createGoalDto.current_amount || 0,
          target_date: createGoalDto.target_date,
          priority: createGoalDto.priority || 'medium',
          color: createGoalDto.color || '#10B981',
          icon: createGoalDto.icon || 'target',
        },
      ])
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to create savings goal: ${error.message}`,
      );
    }

    return {
      ...goal,
      progress_percentage: (goal.current_amount / goal.target_amount) * 100,
    };
  }

  async getSavingsGoals(userId: string): Promise<SavingsGoalDto[]> {
    const { data: goals, error } = await this.supabaseService
      .getClient()
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(
        `Failed to fetch savings goals: ${error.message}`,
      );
    }

    return (goals || []).map((goal) => ({
      ...goal,
      progress_percentage: (goal.current_amount / goal.target_amount) * 100,
    }));
  }

  async updateSavingsGoal(
    userId: string,
    goalId: string,
    updateGoalDto: UpdateSavingsGoalDto,
  ): Promise<SavingsGoalDto> {
    const { data: goal, error } = await this.supabaseService
      .getClient()
      .from('savings_goals')
      .update({
        ...updateGoalDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', goalId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      throw new NotFoundException(
        `Savings goal not found or failed to update: ${error.message}`,
      );
    }

    return {
      ...goal,
      progress_percentage: (goal.current_amount / goal.target_amount) * 100,
    };
  }

  async deleteSavingsGoal(userId: string, goalId: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('savings_goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', userId);

    if (error) {
      throw new NotFoundException(
        `Savings goal not found or failed to delete: ${error.message}`,
      );
    }
  }

  // ========== SAVINGS TOOL METHODS ==========

  async createSavingsTool(
    userId: string,
    createToolDto: CreateSavingsToolDto,
  ): Promise<SavingsToolDto> {
    const { data: tool, error } = await this.supabaseService
      .getClient()
      .from('savings_tools')
      .insert([
        {
          user_id: userId,
          name: createToolDto.name,
          type: createToolDto.type,
          current_value: createToolDto.current_value || 0,
          initial_investment: createToolDto.initial_investment || 0,
          description: createToolDto.description,
          notes: createToolDto.notes,
        },
      ])
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to create savings tool: ${error.message}`,
      );
    }

    return {
      ...tool,
      return_percentage:
        tool.initial_investment > 0
          ? ((tool.current_value - tool.initial_investment) /
              tool.initial_investment) *
            100
          : 0,
    };
  }

  async getSavingsTools(userId: string): Promise<SavingsToolDto[]> {
    const { data: tools, error } = await this.supabaseService
      .getClient()
      .from('savings_tools')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(
        `Failed to fetch savings tools: ${error.message}`,
      );
    }

    return (tools || []).map((tool) => ({
      ...tool,
      return_percentage:
        tool.initial_investment > 0
          ? ((tool.current_value - tool.initial_investment) /
              tool.initial_investment) *
            100
          : 0,
    }));
  }

  async updateSavingsTool(
    userId: string,
    toolId: string,
    updateToolDto: UpdateSavingsToolDto,
  ): Promise<SavingsToolDto> {
    const { data: tool, error } = await this.supabaseService
      .getClient()
      .from('savings_tools')
      .update({
        ...updateToolDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', toolId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      throw new NotFoundException(
        `Savings tool not found or failed to update: ${error.message}`,
      );
    }

    return {
      ...tool,
      return_percentage:
        tool.initial_investment > 0
          ? ((tool.current_value - tool.initial_investment) /
              tool.initial_investment) *
            100
          : 0,
    };
  }

  async deleteSavingsTool(userId: string, toolId: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('savings_tools')
      .update({ is_active: false })
      .eq('id', toolId)
      .eq('user_id', userId);

    if (error) {
      throw new NotFoundException(
        `Savings tool not found or failed to delete: ${error.message}`,
      );
    }
  }

  // ========== ANALYSIS METHODS ==========

  async getAnalysisSummary(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<AnalysisSummaryDto> {
    let transactionQuery = this.supabaseService
      .getClient()
      .from('transactions')
      .select('amount, type, category_id, date')
      .eq('user_id', userId);

    if (startDate) {
      transactionQuery = transactionQuery.gte('date', startDate);
    }
    if (endDate) {
      transactionQuery = transactionQuery.lte('date', endDate);
    }

    const { data: transactions, error } = await transactionQuery;

    if (error) {
      throw new BadRequestException(
        `Failed to fetch analysis data: ${error.message}`,
      );
    }

    const totalIncome =
      transactions
        ?.filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

    const totalExpenses =
      transactions
        ?.filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Calculate top categories
    const categoryTotals = new Map();
    transactions?.forEach((transaction) => {
      const categoryId = transaction.category_id;
      const amount = parseFloat(transaction.amount);
      categoryTotals.set(
        categoryId,
        (categoryTotals.get(categoryId) || 0) + amount,
      );
    });

    const topExpenseCategories = Array.from(categoryTotals.entries())
      .map(([categoryId, total]) => ({
        category_id: categoryId,
        total: total,
        type: 'expense',
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const topIncomeCategories = Array.from(categoryTotals.entries())
      .map(([categoryId, total]) => ({
        category_id: categoryId,
        total: total,
        type: 'income',
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const totalTransactions = transactions?.length || 0;
    const averageDailySpending =
      totalExpenses / Math.max(1, totalTransactions / 30); // Rough estimate

    return {
      total_income: totalIncome,
      total_expenses: totalExpenses,
      net_savings: netSavings,
      savings_rate: savingsRate,
      top_expense_categories: topExpenseCategories,
      top_income_categories: topIncomeCategories,
      monthly_trends: [], // TODO: Implement monthly trends
      average_daily_spending: averageDailySpending,
      total_transactions: totalTransactions,
    };
  }

  async getMonthlyReport(
    userId: string,
    year: number,
    month: number,
  ): Promise<MonthlyReportDto> {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

    const analysis = await this.getAnalysisSummary(userId, startDate, endDate);

    // Check if report already exists
    const { data: existingReport } = await this.supabaseService
      .getClient()
      .from('monthly_reports')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .eq('month', month)
      .single();

    if (existingReport) {
      return existingReport;
    }

    // Create new monthly report
    const { data: report, error } = await this.supabaseService
      .getClient()
      .from('monthly_reports')
      .insert([
        {
          user_id: userId,
          year,
          month,
          total_income: analysis.total_income,
          total_expenses: analysis.total_expenses,
          net_savings: analysis.net_savings,
          top_categories: {
            expenses: analysis.top_expense_categories,
            income: analysis.top_income_categories,
          },
        },
      ])
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to create monthly report: ${error.message}`,
      );
    }

    return report;
  }

  // ========== UTILITY METHODS ==========

  async createDefaultCategories(userId: string): Promise<void> {
    const defaultCategories = [
      { name: 'Salary', type: 'income', color: '#10B981', icon: 'money' },
      {
        name: 'Freelance',
        type: 'income',
        color: '#059669',
        icon: 'briefcase',
      },
      {
        name: 'Investment',
        type: 'income',
        color: '#047857',
        icon: 'trending-up',
      },
      {
        name: 'Food & Dining',
        type: 'expense',
        color: '#EF4444',
        icon: 'utensils',
      },
      {
        name: 'Transportation',
        type: 'expense',
        color: '#F97316',
        icon: 'car',
      },
      {
        name: 'Shopping',
        type: 'expense',
        color: '#8B5CF6',
        icon: 'shopping-bag',
      },
      { name: 'Healthcare', type: 'expense', color: '#EC4899', icon: 'heart' },
      {
        name: 'Entertainment',
        type: 'expense',
        color: '#06B6D4',
        icon: 'play',
      },
      { name: 'Utilities', type: 'expense', color: '#84CC16', icon: 'zap' },
      { name: 'Housing', type: 'expense', color: '#F59E0B', icon: 'home' },
    ];

    const categoriesToInsert = defaultCategories.map((cat) => ({
      user_id: userId,
      ...cat,
      is_default: true,
    }));

    const { error } = await this.supabaseService
      .getClient()
      .from('categories')
      .insert(categoriesToInsert);

    if (error) {
      console.error('Failed to create default categories:', error);
    }
  }
}
