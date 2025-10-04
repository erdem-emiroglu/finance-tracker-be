import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsArray,
  IsEnum,
  IsUUID,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Category DTOs
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

export enum SavingsToolType {
  BANK_ACCOUNT = 'bank_account',
  INVESTMENT = 'investment',
  CRYPTO = 'crypto',
  REAL_ESTATE = 'real_estate',
  OTHER = 'other',
}

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Food & Dining',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({
    description: 'Category color in hex format',
    example: '#EF4444',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    description: 'Icon name for the category',
    example: 'utensils',
  })
  @IsOptional()
  @IsString()
  icon?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Food & Dining',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    description: 'Category color in hex format',
    example: '#EF4444',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    description: 'Icon name for the category',
    example: 'utensils',
  })
  @IsOptional()
  @IsString()
  icon?: string;
}

export class CategoryDto {
  @ApiProperty({ description: 'Category ID' })
  id: string;

  @ApiProperty({ description: 'Category name' })
  name: string;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ description: 'Category color' })
  color: string;

  @ApiProperty({ description: 'Icon name' })
  icon: string;

  @ApiProperty({ description: 'Is default category' })
  is_default: boolean;

  @ApiProperty({ description: 'Creation date' })
  created_at: string;
}

// Transaction DTOs
export class CreateTransactionDto {
  @ApiProperty({
    description: 'Category ID',
    example: 'uuid-here',
  })
  @IsUUID()
  category_id: string;

  @ApiProperty({
    description: 'Transaction amount',
    example: 150.5,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({
    description: 'Transaction description',
    example: 'Lunch at restaurant',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({
    description: 'Transaction date',
    example: '2025-01-03T12:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Transaction tags',
    example: ['work', 'business'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Transaction location',
    example: 'Istanbul, Turkey',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({
    description: 'Payment method',
    example: 'Credit Card',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  payment_method?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Business expense',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({
    description: 'Is recurring transaction',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  is_recurring?: boolean;

  @ApiPropertyOptional({
    description: 'Recurring frequency',
    example: 'monthly',
  })
  @IsOptional()
  @IsString()
  recurring_frequency?: string;

  @ApiPropertyOptional({
    description: 'Recurring end date',
    example: '2025-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  recurring_end_date?: string;
}

export class UpdateTransactionDto {
  @ApiPropertyOptional({ description: 'Category ID' })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiPropertyOptional({ description: 'Transaction amount' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({ description: 'Transaction description' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ description: 'Transaction date' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ description: 'Transaction tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Transaction location' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({ description: 'Payment method' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  payment_method?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class TransactionDto {
  @ApiProperty({ description: 'Transaction ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  user_id: string;

  @ApiProperty({ description: 'Category ID' })
  category_id: string;

  @ApiProperty({ description: 'Transaction amount' })
  amount: number;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ description: 'Transaction description' })
  description?: string;

  @ApiProperty({ description: 'Transaction date' })
  date: string;

  @ApiProperty({ description: 'Transaction tags' })
  tags: string[];

  @ApiProperty({ description: 'Transaction location' })
  location?: string;

  @ApiProperty({ description: 'Payment method' })
  payment_method?: string;

  @ApiProperty({ description: 'Additional notes' })
  notes?: string;

  @ApiProperty({ description: 'Is recurring' })
  is_recurring: boolean;

  @ApiProperty({ description: 'Recurring frequency' })
  recurring_frequency?: string;

  @ApiProperty({ description: 'Creation date' })
  created_at: string;

  @ApiProperty({ description: 'Category information' })
  category?: CategoryDto;
}

// Savings Goal DTOs
export class CreateSavingsGoalDto {
  @ApiProperty({
    description: 'Goal name',
    example: 'Vacation Fund',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Goal description',
    example: 'Save money for summer vacation',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Target amount',
    example: 5000.0,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  target_amount: number;

  @ApiPropertyOptional({
    description: 'Current amount',
    example: 1200.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  current_amount?: number;

  @ApiPropertyOptional({
    description: 'Target date',
    example: '2025-08-15',
  })
  @IsOptional()
  @IsDateString()
  target_date?: string;

  @ApiPropertyOptional({
    description: 'Priority level',
    enum: PriorityLevel,
    example: PriorityLevel.HIGH,
  })
  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel;

  @ApiPropertyOptional({
    description: 'Goal color in hex format',
    example: '#10B981',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    description: 'Icon name for the goal',
    example: 'target',
  })
  @IsOptional()
  @IsString()
  icon?: string;
}

export class UpdateSavingsGoalDto {
  @ApiPropertyOptional({ description: 'Goal name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'Goal description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Target amount' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  target_amount?: number;

  @ApiPropertyOptional({ description: 'Current amount' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  current_amount?: number;

  @ApiPropertyOptional({ description: 'Target date' })
  @IsOptional()
  @IsDateString()
  target_date?: string;

  @ApiPropertyOptional({ description: 'Priority level', enum: PriorityLevel })
  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel;

  @ApiPropertyOptional({ description: 'Goal status', enum: GoalStatus })
  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;

  @ApiPropertyOptional({ description: 'Goal color' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'Icon name' })
  @IsOptional()
  @IsString()
  icon?: string;
}

export class SavingsGoalDto {
  @ApiProperty({ description: 'Goal ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  user_id: string;

  @ApiProperty({ description: 'Goal name' })
  name: string;

  @ApiProperty({ description: 'Goal description' })
  description?: string;

  @ApiProperty({ description: 'Target amount' })
  target_amount: number;

  @ApiProperty({ description: 'Current amount' })
  current_amount: number;

  @ApiProperty({ description: 'Target date' })
  target_date?: string;

  @ApiProperty({ description: 'Priority level', enum: PriorityLevel })
  priority: PriorityLevel;

  @ApiProperty({ description: 'Goal status', enum: GoalStatus })
  status: GoalStatus;

  @ApiProperty({ description: 'Goal color' })
  color: string;

  @ApiProperty({ description: 'Icon name' })
  icon: string;

  @ApiProperty({ description: 'Creation date' })
  created_at: string;

  @ApiProperty({ description: 'Progress percentage' })
  progress_percentage: number;
}

// Savings Tool DTOs
export class CreateSavingsToolDto {
  @ApiProperty({
    description: 'Tool name',
    example: 'High Yield Savings Account',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Tool type',
    enum: SavingsToolType,
    example: SavingsToolType.BANK_ACCOUNT,
  })
  @IsEnum(SavingsToolType)
  type: SavingsToolType;

  @ApiPropertyOptional({
    description: 'Current value',
    example: 15000.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  current_value?: number;

  @ApiPropertyOptional({
    description: 'Initial investment',
    example: 10000.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  initial_investment?: number;

  @ApiPropertyOptional({
    description: 'Tool description',
    example: 'Online savings account with 4.5% APY',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'FDIC insured',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class UpdateSavingsToolDto {
  @ApiPropertyOptional({ description: 'Tool name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'Current value' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  current_value?: number;

  @ApiPropertyOptional({ description: 'Initial investment' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  initial_investment?: number;

  @ApiPropertyOptional({ description: 'Tool description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class SavingsToolDto {
  @ApiProperty({ description: 'Tool ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  user_id: string;

  @ApiProperty({ description: 'Tool name' })
  name: string;

  @ApiProperty({ description: 'Tool type', enum: SavingsToolType })
  type: SavingsToolType;

  @ApiProperty({ description: 'Current value' })
  current_value: number;

  @ApiProperty({ description: 'Initial investment' })
  initial_investment: number;

  @ApiProperty({ description: 'Tool description' })
  description?: string;

  @ApiProperty({ description: 'Additional notes' })
  notes?: string;

  @ApiProperty({ description: 'Is active' })
  is_active: boolean;

  @ApiProperty({ description: 'Creation date' })
  created_at: string;

  @ApiProperty({ description: 'Return percentage' })
  return_percentage: number;
}

// Analysis DTOs
export class TransactionQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for filtering',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering',
    example: '2025-01-31',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Transaction type filter',
    enum: TransactionType,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiPropertyOptional({
    description: 'Category ID filter',
  })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiPropertyOptional({
    description: 'Minimum amount filter',
    example: 10.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_amount?: number;

  @ApiPropertyOptional({
    description: 'Maximum amount filter',
    example: 1000.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  max_amount?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class MonthlyReportDto {
  @ApiProperty({ description: 'Report ID' })
  id: string;

  @ApiProperty({ description: 'Year' })
  year: number;

  @ApiProperty({ description: 'Month' })
  month: number;

  @ApiProperty({ description: 'Total income' })
  total_income: number;

  @ApiProperty({ description: 'Total expenses' })
  total_expenses: number;

  @ApiProperty({ description: 'Net savings' })
  net_savings: number;

  @ApiProperty({ description: 'Top categories breakdown' })
  top_categories: any;

  @ApiProperty({ description: 'PDF report base64' })
  pdf_report_base64?: string;

  @ApiProperty({ description: 'Generated date' })
  generated_at: string;
}

export class AnalysisSummaryDto {
  @ApiProperty({ description: 'Total income for period' })
  total_income: number;

  @ApiProperty({ description: 'Total expenses for period' })
  total_expenses: number;

  @ApiProperty({ description: 'Net savings for period' })
  net_savings: number;

  @ApiProperty({ description: 'Income vs expense ratio' })
  savings_rate: number;

  @ApiProperty({ description: 'Top expense categories' })
  top_expense_categories: any[];

  @ApiProperty({ description: 'Top income categories' })
  top_income_categories: any[];

  @ApiProperty({ description: 'Monthly trends' })
  monthly_trends: any[];

  @ApiProperty({ description: 'Average daily spending' })
  average_daily_spending: number;

  @ApiProperty({ description: 'Total transactions count' })
  total_transactions: number;
}
