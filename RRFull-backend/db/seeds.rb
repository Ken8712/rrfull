# テストユーザーの作成
user1 = User.find_or_create_by!(email: 'test1@example.com') do |user|
  user.name = 'テストユーザー1'
  user.password = 'password123'
  user.password_confirmation = 'password123'
end

user2 = User.find_or_create_by!(email: 'test2@example.com') do |user|
  user.name = 'テストユーザー2'
  user.password = 'password123'
  user.password_confirmation = 'password123'
end

puts "テストユーザーを作成しました:"
puts "- #{user1.email} (パスワード: password123)"
puts "- #{user2.email} (パスワード: password123)"

# サンプルインタラクションの作成
interaction = Interaction.new
interaction.save!

# 両ユーザーをインタラクションに参加させる
interaction.interaction_states.create!(
  user: user1,
  status: 'happy',
  counter: 5
)

interaction.interaction_states.create!(
  user: user2,
  status: 'thinking',
  counter: 3
)

puts "\nサンプルインタラクションを作成しました:"
puts "- コード: #{interaction.code}"
puts "- 参加者: #{interaction.users.pluck(:name).join(', ')}"