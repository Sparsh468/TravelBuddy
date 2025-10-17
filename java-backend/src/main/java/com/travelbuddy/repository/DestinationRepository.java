package com.travelbuddy.repository;

import com.travelbuddy.model.Destination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class DestinationRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Destination> destinationRowMapper = new RowMapper<Destination>() {
        @Override
        public Destination mapRow(ResultSet rs, int rowNum) throws SQLException {
            Destination destination = new Destination();
            destination.setId(rs.getString("id"));
            destination.setName(rs.getString("name"));
            destination.setState(rs.getString("state"));
            destination.setTheme(rs.getString("theme"));
            destination.setImage(rs.getString("image"));
            destination.setBudgetBaseCost(rs.getInt("budget_base_cost"));
            destination.setBalancedBaseCost(rs.getInt("balanced_base_cost"));
            destination.setLuxuryBaseCost(rs.getInt("luxury_base_cost"));
            return destination;
        }
    };

    public List<Destination> findAll() {
        String sql = "SELECT id, name, state, theme, image, budget_base_cost, balanced_base_cost, luxury_base_cost FROM destinations";
        return jdbcTemplate.query(sql, destinationRowMapper);
    }

    public Destination findById(String id) {
        String sql = "SELECT id, name, state, theme, image, budget_base_cost, balanced_base_cost, luxury_base_cost FROM destinations WHERE id = ?";
        List<Destination> destinations = jdbcTemplate.query(sql, destinationRowMapper, id);
        return destinations.isEmpty() ? null : destinations.get(0);
    }

    public List<Destination> findByState(String state) {
        String sql = "SELECT id, name, state, theme, image, budget_base_cost, balanced_base_cost, luxury_base_cost FROM destinations WHERE state = ?";
        return jdbcTemplate.query(sql, destinationRowMapper, state);
    }

    public int save(Destination destination) {
        String sql = "INSERT INTO destinations (id, name, state, theme, image, budget_base_cost, balanced_base_cost, luxury_base_cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, destination.getId(), destination.getName(), destination.getState(),
                destination.getTheme(), destination.getImage(), destination.getBudgetBaseCost(),
                destination.getBalancedBaseCost(), destination.getLuxuryBaseCost());
    }

    public int update(Destination destination) {
        String sql = "UPDATE destinations SET name = ?, state = ?, theme = ?, image = ?, budget_base_cost = ?, balanced_base_cost = ?, luxury_base_cost = ? WHERE id = ?";
        return jdbcTemplate.update(sql, destination.getName(), destination.getState(),
                destination.getTheme(), destination.getImage(), destination.getBudgetBaseCost(),
                destination.getBalancedBaseCost(), destination.getLuxuryBaseCost(), destination.getId());
    }

    public int deleteById(String id) {
        String sql = "DELETE FROM destinations WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}

